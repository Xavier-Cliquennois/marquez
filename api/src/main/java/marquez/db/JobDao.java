/*
 * Copyright 2018-2023 contributors to the Marquez project
 * SPDX-License-Identifier: Apache-2.0
 */

package marquez.db;

import static marquez.db.OpenLineageDao.DEFAULT_NAMESPACE_OWNER;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URL;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import marquez.common.models.DatasetId;
import marquez.common.models.DatasetName;
import marquez.common.models.JobName;
import marquez.common.models.JobType;
import marquez.common.models.NamespaceName;
import marquez.db.mappers.JobMapper;
import marquez.db.mappers.JobRowMapper;
import marquez.db.models.JobRow;
import marquez.db.models.NamespaceRow;
import marquez.service.models.Job;
import marquez.service.models.JobMeta;
import marquez.service.models.Run;
import org.jdbi.v3.sqlobject.config.RegisterRowMapper;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.postgresql.util.PGobject;

@RegisterRowMapper(JobRowMapper.class)
@RegisterRowMapper(JobMapper.class)
public interface JobDao extends BaseDao {

  @SqlQuery(
      """
    SELECT EXISTS (
      SELECT 1 FROM jobs_view AS j
      WHERE j.namespace_name = :namespaceName AND
      j.name = :jobName)
  """)
  boolean exists(String namespaceName, String jobName);

  @SqlUpdate(
      """
    UPDATE jobs
    SET updated_at = :updatedAt,
        current_version_uuid = :currentVersionUuid
    WHERE uuid = :rowUuid
  """)
  void updateVersionFor(UUID rowUuid, Instant updatedAt, UUID currentVersionUuid);

  @SqlQuery(
      """
    SELECT j.*, f.facets
    FROM jobs_view j
    LEFT OUTER JOIN job_versions AS jv ON jv.uuid = j.current_version_uuid
    LEFT OUTER JOIN (
      SELECT run_uuid, JSON_AGG(e.facet) AS facets
      FROM (
        SELECT jf.run_uuid, jf.facet
        FROM job_facets_view AS jf
        INNER JOIN job_versions jv2 ON jv2.latest_run_uuid=jf.run_uuid
        INNER JOIN jobs_view j2 ON j2.current_version_uuid=jv2.uuid
        WHERE j2.name=:jobName AND j2.namespace_name=:namespaceName
        ORDER BY lineage_event_time ASC
      ) e
      GROUP BY e.run_uuid
    ) f ON f.run_uuid=jv.latest_run_uuid
    WHERE j.namespace_name=:namespaceName AND (j.name=:jobName OR :jobName = ANY(j.aliases))
  """)
  Optional<Job> findJobByName(String namespaceName, String jobName);

  @SqlUpdate(
      """
    UPDATE jobs
    SET is_hidden = true
    WHERE namespace_name = :namespaceName
    AND name = :name
  """)
  void delete(String namespaceName, String name);

  @SqlUpdate(
      """
  UPDATE jobs
  SET is_hidden = true
  FROM namespaces n
  WHERE jobs.namespace_uuid = n.uuid
  AND n.name = :namespaceName
  """)
  void deleteByNamespaceName(String namespaceName);

  default Optional<Job> findWithRun(String namespaceName, String jobName) {
    Optional<Job> job = findJobByName(namespaceName, jobName);
    job.ifPresent(
        j -> {
          Optional<Run> run = createRunDao().findByLatestJob(namespaceName, jobName);
          run.ifPresent(r -> this.setJobData(r, j));
        });
    return job;
  }

  @SqlQuery(
      """
    SELECT j.*, n.name AS namespace_name
    FROM jobs_view AS j
    INNER JOIN namespaces AS n ON j.namespace_uuid = n.uuid
    WHERE j.uuid=:jobUuid
  """)
  Optional<JobRow> findJobByUuidAsRow(UUID jobUuid);

  @SqlQuery(
      """
    SELECT j.*, n.name AS namespace_name
    FROM jobs_view AS j
    INNER JOIN namespaces AS n ON j.namespace_uuid = n.uuid
    WHERE j.namespace_name=:namespaceName AND
      (j.name=:jobName OR :jobName = ANY(j.aliases))
  """)
  Optional<JobRow> findJobByNameAsRow(String namespaceName, String jobName);

  @SqlQuery(
      """
    WITH jobs_view_page
    AS (
      SELECT
        *
      FROM
        jobs_view AS j
      WHERE
        j.namespace_name = :namespaceName
      ORDER BY
        j.name
      LIMIT
        :limit
      OFFSET
        :offset
    ),
    job_versions_temp AS (
      SELECT
        *
      FROM
        job_versions AS j
      WHERE
        j.namespace_name = :namespaceName
    ),
    facets_temp AS (
    SELECT
      run_uuid,
        JSON_AGG(e.facet) AS facets
    FROM (
        SELECT
          jf.run_uuid,
            jf.facet
        FROM
          job_facets_view AS jf
        INNER JOIN job_versions_temp jv2
          ON jv2.latest_run_uuid = jf.run_uuid
        INNER JOIN jobs_view_page j2
          ON j2.current_version_uuid = jv2.uuid
        ORDER BY
          lineage_event_time ASC
        ) e
    GROUP BY e.run_uuid
    )
    SELECT
      j.*,
      f.facets
    FROM
      jobs_view_page AS j
    LEFT OUTER JOIN job_versions_temp AS jv
      ON jv.uuid = j.current_version_uuid
    LEFT OUTER JOIN facets_temp AS f
      ON f.run_uuid = jv.latest_run_uuid
    ORDER BY
        j.name
  """)
  List<Job> findAll(String namespaceName, int limit, int offset);

  @SqlQuery("SELECT count(*) FROM jobs_view AS j WHERE symlink_target_uuid IS NULL")
  int count();

  @SqlQuery(
      "SELECT count(*) FROM jobs_view AS j WHERE j.namespace_name = :namespaceName\n"
          + "AND symlink_target_uuid IS NULL")
  int countFor(String namespaceName);

  default List<Job> findAllWithRun(String namespaceName, int limit, int offset) {
    RunDao runDao = createRunDao();
    return findAll(namespaceName, limit, offset).stream()
        .peek(
            j ->
                runDao
                    .findByLatestJob(namespaceName, j.getName().getValue())
                    .ifPresent(run -> this.setJobData(run, j)))
        .collect(Collectors.toList());
  }

  default void setJobData(Run run, Job j) {
    j.setLatestRun(run);
    DatasetVersionDao datasetVersionDao = createDatasetVersionDao();
    j.setInputs(
        datasetVersionDao.findInputDatasetVersionsFor(run.getId().getValue()).stream()
            .map(
                ds ->
                    new DatasetId(
                        NamespaceName.of(ds.getNamespaceName()),
                        DatasetName.of(ds.getDatasetName())))
            .collect(Collectors.toSet()));
    j.setOutputs(
        datasetVersionDao.findOutputDatasetVersionsFor(run.getId().getValue()).stream()
            .map(
                ds ->
                    new DatasetId(
                        NamespaceName.of(ds.getNamespaceName()),
                        DatasetName.of(ds.getDatasetName())))
            .collect(Collectors.toSet()));
  }

  default JobRow upsertJobMeta(
      NamespaceName namespaceName, JobName jobName, JobMeta jobMeta, ObjectMapper mapper) {
    return upsertJobMeta(namespaceName, jobName, null, jobMeta, mapper);
  }

  default JobRow upsertJobMeta(
      NamespaceName namespaceName,
      JobName jobName,
      UUID symlinkTargetUuid,
      JobMeta jobMeta,
      ObjectMapper mapper) {
    Instant createdAt = Instant.now();
    NamespaceRow namespace =
        createNamespaceDao()
            .upsertNamespaceRow(
                UUID.randomUUID(), createdAt, namespaceName.getValue(), DEFAULT_NAMESPACE_OWNER);
    return upsertJob(
        UUID.randomUUID(),
        jobMeta.getType(),
        createdAt,
        namespace.getUuid(),
        namespace.getName(),
        jobName.getValue(),
        jobMeta.getDescription().orElse(null),
        toUrlString(jobMeta.getLocation().orElse(null)),
        symlinkTargetUuid,
        toJson(jobMeta.getInputs(), mapper));
  }

  default String toUrlString(URL url) {
    if (url == null) {
      return null;
    }
    return url.toString();
  }

  default PGobject toJson(Set<DatasetId> dataset, ObjectMapper mapper) {
    try {
      PGobject jsonObject = new PGobject();
      jsonObject.setType("json");
      jsonObject.setValue(mapper.writeValueAsString(dataset));
      return jsonObject;
    } catch (Exception e) {
      return null;
    }
  }

  /*
   Note: following SQL never executes. There is database trigger on `jobs_view` that replaces following SQL
   with rewrite_jobs_fqn_table plpgsql function. Code of that function is at R__1 migration file.
  */
  @SqlQuery(
      """
    INSERT INTO jobs_view AS j (
      uuid,
      type,
      created_at,
      updated_at,
      namespace_uuid,
      namespace_name,
      name,
      description,
      current_job_context_uuid,
      current_location,
      current_inputs,
      symlink_target_uuid,
      parent_job_uuid_string
    ) VALUES (
      :uuid,
      :type,
      :now,
      :now,
      :namespaceUuid,
      :namespaceName,
      :name,
      :description,
      null,
      :location,
      :inputs,
      :symlinkTargetId,
      ''
    ) RETURNING *
  """)
  JobRow upsertJob(
      UUID uuid,
      JobType type,
      Instant now,
      UUID namespaceUuid,
      String namespaceName,
      String name,
      String description,
      String location,
      UUID symlinkTargetId,
      PGobject inputs);

  /*
   Note: following SQL never executes. There is database trigger on `jobs_view` that replaces following SQL
   with rewrite_jobs_fqn_table plpgsql function. Code of that function is at R__1 migration file.
  */
  @SqlQuery(
      """
    INSERT INTO jobs_view AS j (
      uuid,
      parent_job_uuid,
      type,
      created_at,
      updated_at,
      namespace_uuid,
      namespace_name,
      name,
      description,
      current_job_context_uuid,
      current_location,
      current_inputs,
      symlink_target_uuid
    ) VALUES (
      :uuid,
      :parentJobUuid,
      :type,
      :now,
      :now,
      :namespaceUuid,
      :namespaceName,
      :name,
      :description,
      null,
      :location,
      :inputs,
      :symlinkTargetId
    )
    RETURNING *
  """)
  JobRow upsertJob(
      UUID uuid,
      UUID parentJobUuid,
      JobType type,
      Instant now,
      UUID namespaceUuid,
      String namespaceName,
      String name,
      String description,
      String location,
      UUID symlinkTargetId,
      PGobject inputs);
}
