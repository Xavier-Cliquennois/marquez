/*
 * Copyright 2018-2023 contributors to the Marquez project
 * SPDX-License-Identifier: Apache-2.0
 */

package marquez.db.exceptions;

import javax.annotation.Nullable;

/** An exception thrown to indicate a database retention policy error. */
public final class DbRetentionException extends DbException {

  /** Constructs a {@code DbRetentionException} with the provided {@code message}. */
  public DbRetentionException(@Nullable String message) {
    super(message);
  }
}
