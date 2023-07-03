import React, { useState } from 'react'
import { LineageNode } from '../../../types';
import { Zoom } from "@visx/zoom";
import { Tree, hierarchy } from "@visx/hierarchy";
import { Group } from "@visx/group";
import { localPoint } from "@visx/event";
import { Box } from '@mui/system';
import Node, { NodeType } from './Node';
import AnimatedLinks from './AnimatedLinks';
import AnimatedNodes from './AnimatedNodes';

import 'reactflow/dist/style.css'


// TODO Remove this mock data
// const dataMockKedroViz = {
//     "nodes": [
//         {
//             "id": "69c523b6",
//             "name": "apply_types_to_companies",
//             "tags": [],
//             "pipelines": [
//                 "Data ingestion",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "task",
//             "modular_pipelines": [
//                 "ingestion"
//             ],
//             "parameters": {}
//         },
//         {
//             "id": "aed46479",
//             "name": "companies",
//             "tags": [],
//             "pipelines": [
//                 "Data ingestion",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "data",
//             "modular_pipelines": [],
//             "layer": "raw",
//             "dataset_type": "pandas.csv_dataset.CSVDataSet"
//         },
//         {
//             "id": "f23ad217",
//             "name": "ingestion.int_typed_companies",
//             "tags": [],
//             "pipelines": [
//                 "Data ingestion",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "data",
//             "modular_pipelines": [
//                 "ingestion"
//             ],
//             "layer": "intermediate",
//             "dataset_type": "pandas.parquet_dataset.ParquetDataSet"
//         },
//         {
//             "id": "82d36a1b",
//             "name": "apply_types_to_reviews",
//             "tags": [],
//             "pipelines": [
//                 "Data ingestion",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "task",
//             "modular_pipelines": [
//                 "ingestion"
//             ],
//             "parameters": {
//                 "ingestion.typing.reviews.columns_as_floats": [
//                     "reviews_per_month"
//                 ]
//             }
//         },
//         {
//             "id": "7b2c6e04",
//             "name": "reviews",
//             "tags": [],
//             "pipelines": [
//                 "Data ingestion",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "data",
//             "modular_pipelines": [],
//             "layer": "raw",
//             "dataset_type": "pandas.csv_dataset.CSVDataSet"
//         },
//         {
//             "id": "b5609df0",
//             "name": "params:ingestion.typing.reviews.columns_as_floats",
//             "tags": [],
//             "pipelines": [
//                 "Data ingestion",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "parameters",
//             "modular_pipelines": [
//                 "ingestion",
//                 "ingestion.typing",
//                 "ingestion.typing.reviews"
//             ],
//             "layer": null,
//             "dataset_type": null
//         },
//         {
//             "id": "4f7ffa1b",
//             "name": "ingestion.int_typed_reviews",
//             "tags": [],
//             "pipelines": [
//                 "Data ingestion",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "data",
//             "modular_pipelines": [
//                 "ingestion"
//             ],
//             "layer": "intermediate",
//             "dataset_type": "pandas.parquet_dataset.ParquetDataSet"
//         },
//         {
//             "id": "f33b9291",
//             "name": "apply_types_to_shuttles",
//             "tags": [],
//             "pipelines": [
//                 "Data ingestion",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "task",
//             "modular_pipelines": [
//                 "ingestion"
//             ],
//             "parameters": {}
//         },
//         {
//             "id": "f1d596c2",
//             "name": "shuttles",
//             "tags": [],
//             "pipelines": [
//                 "Data ingestion",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "data",
//             "modular_pipelines": [],
//             "layer": "raw",
//             "dataset_type": "pandas.excel_dataset.ExcelDataSet"
//         },
//         {
//             "id": "c0ddbcbf",
//             "name": "ingestion.int_typed_shuttles",
//             "tags": [],
//             "pipelines": [
//                 "Data ingestion",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "data",
//             "modular_pipelines": [
//                 "ingestion"
//             ],
//             "layer": "intermediate",
//             "dataset_type": null
//         },
//         {
//             "id": "8de402c1",
//             "name": "company_agg",
//             "tags": [],
//             "pipelines": [
//                 "Data ingestion",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "task",
//             "modular_pipelines": [
//                 "ingestion"
//             ],
//             "parameters": {}
//         },
//         {
//             "id": "8f20d98e",
//             "name": "ingestion.prm_agg_companies",
//             "tags": [],
//             "pipelines": [
//                 "Data ingestion",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "data",
//             "modular_pipelines": [
//                 "ingestion"
//             ],
//             "layer": null,
//             "dataset_type": "io.memory_dataset.MemoryDataSet"
//         },
//         {
//             "id": "bac77866",
//             "name": "combine_step",
//             "tags": [],
//             "pipelines": [
//                 "Data ingestion",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "task",
//             "modular_pipelines": [
//                 "ingestion"
//             ],
//             "parameters": {}
//         },
//         {
//             "id": "9f266f06",
//             "name": "prm_shuttle_company_reviews",
//             "tags": [],
//             "pipelines": [
//                 "Reporting stage",
//                 "Feature engineering",
//                 "Data ingestion",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "data",
//             "modular_pipelines": [],
//             "layer": "primary",
//             "dataset_type": "pandas.parquet_dataset.ParquetDataSet"
//         },
//         {
//             "id": "f063cc82",
//             "name": "prm_spine_table",
//             "tags": [],
//             "pipelines": [
//                 "Data ingestion",
//                 "Feature engineering",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "data",
//             "modular_pipelines": [],
//             "layer": "primary",
//             "dataset_type": "pandas.parquet_dataset.ParquetDataSet"
//         },
//         {
//             "id": "d6abbcff",
//             "name": "create_derived_features",
//             "tags": [],
//             "pipelines": [
//                 "Feature engineering",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "task",
//             "modular_pipelines": [
//                 "feature_engineering"
//             ],
//             "parameters": {
//                 "feature_engineering.feature.derived": [
//                     {
//                         "column_a": "number_of_reviews",
//                         "column_b": "total_fleet_count",
//                         "numpy_method": "divide",
//                         "conjunction": "over"
//                     },
//                     {
//                         "column_a": "number_of_reviews",
//                         "column_b": "total_fleet_count",
//                         "numpy_method": "divide",
//                         "conjunction": "over"
//                     },
//                     {
//                         "column_a": "reviews_per_month",
//                         "column_b": "company_rating",
//                         "numpy_method": "multiply",
//                         "conjunction": "by"
//                     }
//                 ]
//             }
//         },
//         {
//             "id": "abed6a4d",
//             "name": "params:feature_engineering.feature.derived",
//             "tags": [],
//             "pipelines": [
//                 "Feature engineering",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "parameters",
//             "modular_pipelines": [
//                 "feature_engineering",
//                 "feature_engineering.feature"
//             ],
//             "layer": null,
//             "dataset_type": null
//         },
//         {
//             "id": "7c92a703",
//             "name": "feature_engineering.feat_derived_features",
//             "tags": [],
//             "pipelines": [
//                 "Feature engineering",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "data",
//             "modular_pipelines": [
//                 "feature_engineering"
//             ],
//             "layer": null,
//             "dataset_type": "io.memory_dataset.MemoryDataSet"
//         },
//         {
//             "id": "7932e672",
//             "name": "create_feature_importance",
//             "tags": [],
//             "pipelines": [
//                 "Feature engineering",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "task",
//             "modular_pipelines": [
//                 "feature_engineering"
//             ],
//             "parameters": {}
//         },
//         {
//             "id": "1e3cc50a",
//             "name": "feature_importance_output",
//             "tags": [],
//             "pipelines": [
//                 "Reporting stage",
//                 "Feature engineering",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "data",
//             "modular_pipelines": [],
//             "layer": "feature",
//             "dataset_type": "pandas.csv_dataset.CSVDataSet"
//         },
//         {
//             "id": "9c43f772",
//             "name": "create_static_features",
//             "tags": [],
//             "pipelines": [
//                 "Feature engineering",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "task",
//             "modular_pipelines": [
//                 "feature_engineering"
//             ],
//             "parameters": {
//                 "feature_engineering.feature.static": [
//                     "engines",
//                     "passenger_capacity",
//                     "crew",
//                     "d_check_complete",
//                     "moon_clearance_complete",
//                     "iata_approved",
//                     "company_rating",
//                     "review_scores_rating",
//                     "price"
//                 ]
//             }
//         },
//         {
//             "id": "a3627e31",
//             "name": "params:feature_engineering.feature.static",
//             "tags": [],
//             "pipelines": [
//                 "Feature engineering",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "parameters",
//             "modular_pipelines": [
//                 "feature_engineering",
//                 "feature_engineering.feature"
//             ],
//             "layer": null,
//             "dataset_type": null
//         },
//         {
//             "id": "8e4f1015",
//             "name": "feature_engineering.feat_static_features",
//             "tags": [],
//             "pipelines": [
//                 "Feature engineering",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "data",
//             "modular_pipelines": [
//                 "feature_engineering"
//             ],
//             "layer": null,
//             "dataset_type": "io.memory_dataset.MemoryDataSet"
//         },
//         {
//             "id": "9a6ef457",
//             "name": "<lambda>",
//             "tags": [],
//             "pipelines": [
//                 "Data ingestion",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "task",
//             "modular_pipelines": [
//                 "ingestion"
//             ],
//             "parameters": {}
//         },
//         {
//             "id": "c08c7708",
//             "name": "ingestion.prm_spine_table_clone",
//             "tags": [],
//             "pipelines": [
//                 "Data ingestion",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "data",
//             "modular_pipelines": [
//                 "ingestion"
//             ],
//             "layer": null,
//             "dataset_type": "io.memory_dataset.MemoryDataSet"
//         },
//         {
//             "id": "be6b7919",
//             "name": "create_matplotlib_chart",
//             "tags": [],
//             "pipelines": [
//                 "Reporting stage",
//                 "__default__"
//             ],
//             "type": "task",
//             "modular_pipelines": [
//                 "reporting"
//             ],
//             "parameters": {}
//         },
//         {
//             "id": "3b199c6b",
//             "name": "reporting.confusion_matrix",
//             "tags": [],
//             "pipelines": [
//                 "Reporting stage",
//                 "__default__"
//             ],
//             "type": "data",
//             "modular_pipelines": [
//                 "reporting"
//             ],
//             "layer": null,
//             "dataset_type": "matplotlib.matplotlib_writer.MatplotlibWriter"
//         },
//         {
//             "id": "c7646ea1",
//             "name": "make_cancel_policy_bar_chart",
//             "tags": [],
//             "pipelines": [
//                 "Reporting stage",
//                 "__default__"
//             ],
//             "type": "task",
//             "modular_pipelines": [
//                 "reporting"
//             ],
//             "parameters": {}
//         },
//         {
//             "id": "d0e9b00f",
//             "name": "reporting.cancellation_policy_breakdown",
//             "tags": [],
//             "pipelines": [
//                 "Reporting stage",
//                 "__default__"
//             ],
//             "type": "data",
//             "modular_pipelines": [
//                 "reporting"
//             ],
//             "layer": "reporting",
//             "dataset_type": "plotly.plotly_dataset.PlotlyDataSet"
//         },
//         {
//             "id": "3fb71518",
//             "name": "make_price_analysis_image",
//             "tags": [],
//             "pipelines": [
//                 "Reporting stage",
//                 "__default__"
//             ],
//             "type": "task",
//             "modular_pipelines": [
//                 "reporting"
//             ],
//             "parameters": {}
//         },
//         {
//             "id": "8838ca1f",
//             "name": "reporting.cancellation_policy_grid",
//             "tags": [],
//             "pipelines": [
//                 "Reporting stage",
//                 "__default__"
//             ],
//             "type": "data",
//             "modular_pipelines": [
//                 "reporting"
//             ],
//             "layer": null,
//             "dataset_type": "datasets.image_dataset.ImageDataSet"
//         },
//         {
//             "id": "40886786",
//             "name": "make_price_histogram",
//             "tags": [],
//             "pipelines": [
//                 "Reporting stage",
//                 "__default__"
//             ],
//             "type": "task",
//             "modular_pipelines": [
//                 "reporting"
//             ],
//             "parameters": {}
//         },
//         {
//             "id": "c6992660",
//             "name": "reporting.price_histogram",
//             "tags": [],
//             "pipelines": [
//                 "Reporting stage",
//                 "__default__"
//             ],
//             "type": "data",
//             "modular_pipelines": [
//                 "reporting"
//             ],
//             "layer": "reporting",
//             "dataset_type": "plotly.json_dataset.JSONDataSet"
//         },
//         {
//             "id": "178d37bb",
//             "name": "joiner",
//             "tags": [],
//             "pipelines": [
//                 "Feature engineering",
//                 "__default__",
//                 "Pre-modelling"
//             ],
//             "type": "task",
//             "modular_pipelines": [
//                 "feature_engineering"
//             ],
//             "parameters": {}
//         },
//         {
//             "id": "23c94afb",
//             "name": "model_input_table",
//             "tags": [],
//             "pipelines": [
//                 "Pre-modelling",
//                 "Modelling stage",
//                 "__default__",
//                 "Feature engineering"
//             ],
//             "type": "data",
//             "modular_pipelines": [],
//             "layer": "model_input",
//             "dataset_type": "pandas.parquet_dataset.ParquetDataSet"
//         },
//         {
//             "id": "4adb5c8b",
//             "name": "create_feature_importance_plot",
//             "tags": [],
//             "pipelines": [
//                 "Reporting stage",
//                 "__default__"
//             ],
//             "type": "task",
//             "modular_pipelines": [
//                 "reporting"
//             ],
//             "parameters": {}
//         },
//         {
//             "id": "eb7d6d28",
//             "name": "reporting.feature_importance",
//             "tags": [],
//             "pipelines": [
//                 "Reporting stage",
//                 "__default__"
//             ],
//             "type": "data",
//             "modular_pipelines": [
//                 "reporting"
//             ],
//             "layer": "reporting",
//             "dataset_type": "plotly.json_dataset.JSONDataSet"
//         },
//         {
//             "id": "b85b55e1",
//             "name": "split_data",
//             "tags": [],
//             "pipelines": [
//                 "Modelling stage",
//                 "__default__"
//             ],
//             "type": "task",
//             "modular_pipelines": [],
//             "parameters": {
//                 "split_options": {
//                     "test_size": 0.2,
//                     "random_state": 3,
//                     "target": "price"
//                 }
//             }
//         },
//         {
//             "id": "22eec376",
//             "name": "params:split_options",
//             "tags": [],
//             "pipelines": [
//                 "Modelling stage",
//                 "__default__"
//             ],
//             "type": "parameters",
//             "modular_pipelines": [],
//             "layer": null,
//             "dataset_type": null
//         },
//         {
//             "id": "cae2d1c7",
//             "name": "X_train",
//             "tags": [],
//             "pipelines": [
//                 "Modelling stage",
//                 "__default__"
//             ],
//             "type": "data",
//             "modular_pipelines": [],
//             "layer": null,
//             "dataset_type": "io.memory_dataset.MemoryDataSet"
//         },
//         {
//             "id": "872981f9",
//             "name": "X_test",
//             "tags": [],
//             "pipelines": [
//                 "Modelling stage",
//                 "__default__"
//             ],
//             "type": "data",
//             "modular_pipelines": [],
//             "layer": null,
//             "dataset_type": "io.memory_dataset.MemoryDataSet"
//         },
//         {
//             "id": "9ca016a8",
//             "name": "y_train",
//             "tags": [],
//             "pipelines": [
//                 "Modelling stage",
//                 "__default__"
//             ],
//             "type": "data",
//             "modular_pipelines": [],
//             "layer": null,
//             "dataset_type": "io.memory_dataset.MemoryDataSet"
//         },
//         {
//             "id": "f6d9538c",
//             "name": "y_test",
//             "tags": [],
//             "pipelines": [
//                 "Modelling stage",
//                 "__default__"
//             ],
//             "type": "data",
//             "modular_pipelines": [],
//             "layer": null,
//             "dataset_type": "io.memory_dataset.MemoryDataSet"
//         },
//         {
//             "id": "848e88da",
//             "name": "train_model",
//             "tags": [],
//             "pipelines": [
//                 "Modelling stage",
//                 "__default__"
//             ],
//             "type": "task",
//             "modular_pipelines": [
//                 "train_evaluation",
//                 "train_evaluation.linear_regression"
//             ],
//             "parameters": {
//                 "train_evaluation.model_options.linear_regression": {
//                     "module": "sklearn.linear_model",
//                     "class": "LinearRegression",
//                     "kwargs": {
//                         "fit_intercept": true,
//                         "copy_X": true,
//                         "positive": false
//                     }
//                 }
//             }
//         },
//         {
//             "id": "98eb115e",
//             "name": "params:train_evaluation.model_options.linear_regression",
//             "tags": [],
//             "pipelines": [
//                 "Modelling stage",
//                 "__default__"
//             ],
//             "type": "parameters",
//             "modular_pipelines": [
//                 "train_evaluation",
//                 "train_evaluation.model_options"
//             ],
//             "layer": null,
//             "dataset_type": null
//         },
//         {
//             "id": "10e51dea",
//             "name": "train_evaluation.linear_regression.regressor",
//             "tags": [],
//             "pipelines": [
//                 "Modelling stage",
//                 "__default__"
//             ],
//             "type": "data",
//             "modular_pipelines": [
//                 "train_evaluation",
//                 "train_evaluation.linear_regression"
//             ],
//             "layer": null,
//             "dataset_type": "pickle.pickle_dataset.PickleDataSet"
//         },
//         {
//             "id": "b701864d",
//             "name": "train_evaluation.linear_regression.experiment_params",
//             "tags": [],
//             "pipelines": [
//                 "Modelling stage",
//                 "__default__"
//             ],
//             "type": "data",
//             "modular_pipelines": [
//                 "train_evaluation",
//                 "train_evaluation.linear_regression"
//             ],
//             "layer": null,
//             "dataset_type": "tracking.json_dataset.JSONDataSet"
//         },
//         {
//             "id": "1c0614b4",
//             "name": "train_model",
//             "tags": [],
//             "pipelines": [
//                 "Modelling stage",
//                 "__default__"
//             ],
//             "type": "task",
//             "modular_pipelines": [
//                 "train_evaluation",
//                 "train_evaluation.random_forest"
//             ],
//             "parameters": {
//                 "train_evaluation.model_options.random_forest": {
//                     "module": "sklearn.ensemble",
//                     "class": "RandomForestRegressor",
//                     "kwargs": {
//                         "n_estimators": 100,
//                         "criterion": "squared_error",
//                         "min_samples_split": 2,
//                         "min_samples_leaf": 1,
//                         "min_weight_fraction_leaf": 0,
//                         "max_features": "auto",
//                         "min_impurity_decrease": 0,
//                         "bootstrap": true,
//                         "oob_score": false,
//                         "verbose": 0,
//                         "warm_start": false,
//                         "ccp_alpha": 0
//                     }
//                 }
//             }
//         },
//         {
//             "id": "72baf5c6",
//             "name": "params:train_evaluation.model_options.random_forest",
//             "tags": [],
//             "pipelines": [
//                 "Modelling stage",
//                 "__default__"
//             ],
//             "type": "parameters",
//             "modular_pipelines": [
//                 "train_evaluation",
//                 "train_evaluation.model_options"
//             ],
//             "layer": null,
//             "dataset_type": null
//         },
//         {
//             "id": "01675921",
//             "name": "train_evaluation.random_forest.regressor",
//             "tags": [],
//             "pipelines": [
//                 "Modelling stage",
//                 "__default__"
//             ],
//             "type": "data",
//             "modular_pipelines": [
//                 "train_evaluation",
//                 "train_evaluation.random_forest"
//             ],
//             "layer": null,
//             "dataset_type": "pickle.pickle_dataset.PickleDataSet"
//         },
//         {
//             "id": "4f79de77",
//             "name": "train_evaluation.random_forest.experiment_params",
//             "tags": [],
//             "pipelines": [
//                 "Modelling stage",
//                 "__default__"
//             ],
//             "type": "data",
//             "modular_pipelines": [
//                 "train_evaluation",
//                 "train_evaluation.random_forest"
//             ],
//             "layer": null,
//             "dataset_type": "tracking.json_dataset.JSONDataSet"
//         },
//         {
//             "id": "d6a09df8",
//             "name": "evaluate_model",
//             "tags": [],
//             "pipelines": [
//                 "Modelling stage",
//                 "__default__"
//             ],
//             "type": "task",
//             "modular_pipelines": [
//                 "train_evaluation",
//                 "train_evaluation.linear_regression"
//             ],
//             "parameters": {}
//         },
//         {
//             "id": "495a0bbc",
//             "name": "train_evaluation.linear_regression.r2_score",
//             "tags": [],
//             "pipelines": [
//                 "Modelling stage",
//                 "__default__"
//             ],
//             "type": "data",
//             "modular_pipelines": [
//                 "train_evaluation",
//                 "train_evaluation.linear_regression"
//             ],
//             "layer": null,
//             "dataset_type": "tracking.metrics_dataset.MetricsDataSet"
//         },
//         {
//             "id": "0b70ae9d",
//             "name": "evaluate_model",
//             "tags": [],
//             "pipelines": [
//                 "Modelling stage",
//                 "__default__"
//             ],
//             "type": "task",
//             "modular_pipelines": [
//                 "train_evaluation",
//                 "train_evaluation.random_forest"
//             ],
//             "parameters": {}
//         },
//         {
//             "id": "b16095d0",
//             "name": "train_evaluation.random_forest.r2_score",
//             "tags": [],
//             "pipelines": [
//                 "Modelling stage",
//                 "__default__"
//             ],
//             "type": "data",
//             "modular_pipelines": [
//                 "train_evaluation",
//                 "train_evaluation.random_forest"
//             ],
//             "layer": null,
//             "dataset_type": "tracking.metrics_dataset.MetricsDataSet"
//         },
//         {
//             "id": "feature_engineering",
//             "name": "feature_engineering",
//             "tags": [],
//             "pipelines": [
//                 "__default__"
//             ],
//             "type": "modularPipeline",
//             "modular_pipelines": null,
//             "layer": null,
//             "dataset_type": null
//         },
//         {
//             "id": "ingestion",
//             "name": "ingestion",
//             "tags": [],
//             "pipelines": [
//                 "__default__"
//             ],
//             "type": "modularPipeline",
//             "modular_pipelines": null,
//             "layer": null,
//             "dataset_type": null
//         },
//         {
//             "id": "reporting",
//             "name": "reporting",
//             "tags": [],
//             "pipelines": [
//                 "__default__"
//             ],
//             "type": "modularPipeline",
//             "modular_pipelines": null,
//             "layer": null,
//             "dataset_type": null
//         },
//         {
//             "id": "train_evaluation.linear_regression",
//             "name": "train_evaluation.linear_regression",
//             "tags": [],
//             "pipelines": [
//                 "__default__"
//             ],
//             "type": "modularPipeline",
//             "modular_pipelines": null,
//             "layer": null,
//             "dataset_type": null
//         },
//         {
//             "id": "train_evaluation",
//             "name": "train_evaluation",
//             "tags": [],
//             "pipelines": [
//                 "__default__"
//             ],
//             "type": "modularPipeline",
//             "modular_pipelines": null,
//             "layer": null,
//             "dataset_type": null
//         },
//         {
//             "id": "train_evaluation.random_forest",
//             "name": "train_evaluation.random_forest",
//             "tags": [],
//             "pipelines": [
//                 "__default__"
//             ],
//             "type": "modularPipeline",
//             "modular_pipelines": null,
//             "layer": null,
//             "dataset_type": null
//         }
//     ],
//     "edges": [
//         {
//             "source": "reporting",
//             "target": "d0e9b00f"
//         },
//         {
//             "source": "f063cc82",
//             "target": "7932e672"
//         },
//         {
//             "source": "d6abbcff",
//             "target": "7c92a703"
//         },
//         {
//             "source": "bac77866",
//             "target": "9f266f06"
//         },
//         {
//             "source": "cae2d1c7",
//             "target": "train_evaluation"
//         },
//         {
//             "source": "b5609df0",
//             "target": "ingestion"
//         },
//         {
//             "source": "f063cc82",
//             "target": "178d37bb"
//         },
//         {
//             "source": "feature_engineering",
//             "target": "23c94afb"
//         },
//         {
//             "source": "9ca016a8",
//             "target": "train_evaluation"
//         },
//         {
//             "source": "b5609df0",
//             "target": "82d36a1b"
//         },
//         {
//             "source": "abed6a4d",
//             "target": "feature_engineering"
//         },
//         {
//             "source": "aed46479",
//             "target": "ingestion"
//         },
//         {
//             "source": "cae2d1c7",
//             "target": "1c0614b4"
//         },
//         {
//             "source": "reporting",
//             "target": "3b199c6b"
//         },
//         {
//             "source": "b85b55e1",
//             "target": "872981f9"
//         },
//         {
//             "source": "9f266f06",
//             "target": "be6b7919"
//         },
//         {
//             "source": "72baf5c6",
//             "target": "train_evaluation.random_forest"
//         },
//         {
//             "source": "c0ddbcbf",
//             "target": "bac77866"
//         },
//         {
//             "source": "9ca016a8",
//             "target": "1c0614b4"
//         },
//         {
//             "source": "98eb115e",
//             "target": "848e88da"
//         },
//         {
//             "source": "reporting",
//             "target": "c6992660"
//         },
//         {
//             "source": "872981f9",
//             "target": "train_evaluation.random_forest"
//         },
//         {
//             "source": "f1d596c2",
//             "target": "f33b9291"
//         },
//         {
//             "source": "reporting",
//             "target": "eb7d6d28"
//         },
//         {
//             "source": "f33b9291",
//             "target": "c0ddbcbf"
//         },
//         {
//             "source": "9f266f06",
//             "target": "40886786"
//         },
//         {
//             "source": "f6d9538c",
//             "target": "0b70ae9d"
//         },
//         {
//             "source": "f063cc82",
//             "target": "9a6ef457"
//         },
//         {
//             "source": "feature_engineering",
//             "target": "1e3cc50a"
//         },
//         {
//             "source": "train_evaluation.random_forest",
//             "target": "4f79de77"
//         },
//         {
//             "source": "72baf5c6",
//             "target": "train_evaluation"
//         },
//         {
//             "source": "8e4f1015",
//             "target": "178d37bb"
//         },
//         {
//             "source": "train_evaluation",
//             "target": "b16095d0"
//         },
//         {
//             "source": "4adb5c8b",
//             "target": "eb7d6d28"
//         },
//         {
//             "source": "40886786",
//             "target": "c6992660"
//         },
//         {
//             "source": "f23ad217",
//             "target": "8de402c1"
//         },
//         {
//             "source": "7932e672",
//             "target": "1e3cc50a"
//         },
//         {
//             "source": "872981f9",
//             "target": "train_evaluation"
//         },
//         {
//             "source": "f6d9538c",
//             "target": "train_evaluation.random_forest"
//         },
//         {
//             "source": "72baf5c6",
//             "target": "1c0614b4"
//         },
//         {
//             "source": "01675921",
//             "target": "0b70ae9d"
//         },
//         {
//             "source": "cae2d1c7",
//             "target": "848e88da"
//         },
//         {
//             "source": "f6d9538c",
//             "target": "train_evaluation.linear_regression"
//         },
//         {
//             "source": "22eec376",
//             "target": "b85b55e1"
//         },
//         {
//             "source": "848e88da",
//             "target": "b701864d"
//         },
//         {
//             "source": "a3627e31",
//             "target": "9c43f772"
//         },
//         {
//             "source": "b85b55e1",
//             "target": "f6d9538c"
//         },
//         {
//             "source": "9ca016a8",
//             "target": "848e88da"
//         },
//         {
//             "source": "848e88da",
//             "target": "10e51dea"
//         },
//         {
//             "source": "82d36a1b",
//             "target": "4f7ffa1b"
//         },
//         {
//             "source": "9f266f06",
//             "target": "d6abbcff"
//         },
//         {
//             "source": "b85b55e1",
//             "target": "9ca016a8"
//         },
//         {
//             "source": "f6d9538c",
//             "target": "train_evaluation"
//         },
//         {
//             "source": "d6a09df8",
//             "target": "495a0bbc"
//         },
//         {
//             "source": "98eb115e",
//             "target": "train_evaluation.linear_regression"
//         },
//         {
//             "source": "1c0614b4",
//             "target": "01675921"
//         },
//         {
//             "source": "c7646ea1",
//             "target": "d0e9b00f"
//         },
//         {
//             "source": "train_evaluation",
//             "target": "495a0bbc"
//         },
//         {
//             "source": "train_evaluation",
//             "target": "b701864d"
//         },
//         {
//             "source": "f063cc82",
//             "target": "d6abbcff"
//         },
//         {
//             "source": "7b2c6e04",
//             "target": "82d36a1b"
//         },
//         {
//             "source": "f1d596c2",
//             "target": "ingestion"
//         },
//         {
//             "source": "872981f9",
//             "target": "d6a09df8"
//         },
//         {
//             "source": "1c0614b4",
//             "target": "4f79de77"
//         },
//         {
//             "source": "reporting",
//             "target": "8838ca1f"
//         },
//         {
//             "source": "69c523b6",
//             "target": "f23ad217"
//         },
//         {
//             "source": "1e3cc50a",
//             "target": "reporting"
//         },
//         {
//             "source": "b85b55e1",
//             "target": "cae2d1c7"
//         },
//         {
//             "source": "4f7ffa1b",
//             "target": "bac77866"
//         },
//         {
//             "source": "ingestion",
//             "target": "9f266f06"
//         },
//         {
//             "source": "7c92a703",
//             "target": "178d37bb"
//         },
//         {
//             "source": "8de402c1",
//             "target": "8f20d98e"
//         },
//         {
//             "source": "train_evaluation.linear_regression",
//             "target": "495a0bbc"
//         },
//         {
//             "source": "178d37bb",
//             "target": "23c94afb"
//         },
//         {
//             "source": "train_evaluation.linear_regression",
//             "target": "b701864d"
//         },
//         {
//             "source": "9f266f06",
//             "target": "3fb71518"
//         },
//         {
//             "source": "23c94afb",
//             "target": "b85b55e1"
//         },
//         {
//             "source": "f6d9538c",
//             "target": "d6a09df8"
//         },
//         {
//             "source": "abed6a4d",
//             "target": "d6abbcff"
//         },
//         {
//             "source": "cae2d1c7",
//             "target": "train_evaluation.linear_regression"
//         },
//         {
//             "source": "ingestion",
//             "target": "c08c7708"
//         },
//         {
//             "source": "1e3cc50a",
//             "target": "4adb5c8b"
//         },
//         {
//             "source": "7b2c6e04",
//             "target": "ingestion"
//         },
//         {
//             "source": "9f266f06",
//             "target": "c7646ea1"
//         },
//         {
//             "source": "9ca016a8",
//             "target": "train_evaluation.linear_regression"
//         },
//         {
//             "source": "0b70ae9d",
//             "target": "b16095d0"
//         },
//         {
//             "source": "aed46479",
//             "target": "69c523b6"
//         },
//         {
//             "source": "3fb71518",
//             "target": "8838ca1f"
//         },
//         {
//             "source": "98eb115e",
//             "target": "train_evaluation"
//         },
//         {
//             "source": "train_evaluation",
//             "target": "4f79de77"
//         },
//         {
//             "source": "bac77866",
//             "target": "f063cc82"
//         },
//         {
//             "source": "9f266f06",
//             "target": "feature_engineering"
//         },
//         {
//             "source": "10e51dea",
//             "target": "d6a09df8"
//         },
//         {
//             "source": "9f266f06",
//             "target": "reporting"
//         },
//         {
//             "source": "8f20d98e",
//             "target": "bac77866"
//         },
//         {
//             "source": "cae2d1c7",
//             "target": "train_evaluation.random_forest"
//         },
//         {
//             "source": "9c43f772",
//             "target": "8e4f1015"
//         },
//         {
//             "source": "f063cc82",
//             "target": "feature_engineering"
//         },
//         {
//             "source": "be6b7919",
//             "target": "3b199c6b"
//         },
//         {
//             "source": "9a6ef457",
//             "target": "c08c7708"
//         },
//         {
//             "source": "9ca016a8",
//             "target": "train_evaluation.random_forest"
//         },
//         {
//             "source": "a3627e31",
//             "target": "feature_engineering"
//         },
//         {
//             "source": "872981f9",
//             "target": "train_evaluation.linear_regression"
//         },
//         {
//             "source": "train_evaluation.random_forest",
//             "target": "b16095d0"
//         },
//         {
//             "source": "9f266f06",
//             "target": "9c43f772"
//         },
//         {
//             "source": "872981f9",
//             "target": "0b70ae9d"
//         }
//     ],
//     "layers": [
//         "raw",
//         "intermediate",
//         "primary",
//         "feature",
//         "model_input",
//         "reporting"
//     ],
//     "tags": [],
//     "pipelines": [
//         {
//             "id": "__default__",
//             "name": "__default__"
//         },
//         {
//             "id": "Data ingestion",
//             "name": "Data ingestion"
//         },
//         {
//             "id": "Modelling stage",
//             "name": "Modelling stage"
//         },
//         {
//             "id": "Feature engineering",
//             "name": "Feature engineering"
//         },
//         {
//             "id": "Reporting stage",
//             "name": "Reporting stage"
//         },
//         {
//             "id": "Pre-modelling",
//             "name": "Pre-modelling"
//         }
//     ],
//     "modular_pipelines": {
//         "__root__": {
//             "id": "__root__",
//             "name": "__root__",
//             "inputs": [],
//             "outputs": [],
//             "children": [
//                 {
//                     "id": "cae2d1c7",
//                     "type": "data"
//                 },
//                 {
//                     "id": "872981f9",
//                     "type": "data"
//                 },
//                 {
//                     "id": "23c94afb",
//                     "type": "data"
//                 },
//                 {
//                     "id": "7b2c6e04",
//                     "type": "data"
//                 },
//                 {
//                     "id": "f063cc82",
//                     "type": "data"
//                 },
//                 {
//                     "id": "9ca016a8",
//                     "type": "data"
//                 },
//                 {
//                     "id": "22eec376",
//                     "type": "parameters"
//                 },
//                 {
//                     "id": "f1d596c2",
//                     "type": "data"
//                 },
//                 {
//                     "id": "72baf5c6",
//                     "type": "parameters"
//                 },
//                 {
//                     "id": "98eb115e",
//                     "type": "parameters"
//                 },
//                 {
//                     "id": "ingestion",
//                     "type": "modularPipeline"
//                 },
//                 {
//                     "id": "aed46479",
//                     "type": "data"
//                 },
//                 {
//                     "id": "f6d9538c",
//                     "type": "data"
//                 },
//                 {
//                     "id": "feature_engineering",
//                     "type": "modularPipeline"
//                 },
//                 {
//                     "id": "reporting",
//                     "type": "modularPipeline"
//                 },
//                 {
//                     "id": "b85b55e1",
//                     "type": "task"
//                 },
//                 {
//                     "id": "1e3cc50a",
//                     "type": "data"
//                 },
//                 {
//                     "id": "9f266f06",
//                     "type": "data"
//                 },
//                 {
//                     "id": "train_evaluation",
//                     "type": "modularPipeline"
//                 }
//             ]
//         },
//         "feature_engineering": {
//             "id": "feature_engineering",
//             "name": "feature_engineering",
//             "inputs": [
//                 "9f266f06",
//                 "a3627e31",
//                 "abed6a4d",
//                 "f063cc82"
//             ],
//             "outputs": [
//                 "23c94afb",
//                 "1e3cc50a"
//             ],
//             "children": [
//                 {
//                     "id": "8e4f1015",
//                     "type": "data"
//                 },
//                 {
//                     "id": "7c92a703",
//                     "type": "data"
//                 },
//                 {
//                     "id": "7932e672",
//                     "type": "task"
//                 },
//                 {
//                     "id": "178d37bb",
//                     "type": "task"
//                 },
//                 {
//                     "id": "d6abbcff",
//                     "type": "task"
//                 },
//                 {
//                     "id": "9c43f772",
//                     "type": "task"
//                 }
//             ]
//         },
//         "ingestion": {
//             "id": "ingestion",
//             "name": "ingestion",
//             "inputs": [
//                 "7b2c6e04",
//                 "f1d596c2",
//                 "b5609df0",
//                 "aed46479"
//             ],
//             "outputs": [
//                 "9f266f06",
//                 "c08c7708"
//             ],
//             "children": [
//                 {
//                     "id": "f33b9291",
//                     "type": "task"
//                 },
//                 {
//                     "id": "9a6ef457",
//                     "type": "task"
//                 },
//                 {
//                     "id": "82d36a1b",
//                     "type": "task"
//                 },
//                 {
//                     "id": "c0ddbcbf",
//                     "type": "data"
//                 },
//                 {
//                     "id": "c08c7708",
//                     "type": "data"
//                 },
//                 {
//                     "id": "f23ad217",
//                     "type": "data"
//                 },
//                 {
//                     "id": "bac77866",
//                     "type": "task"
//                 },
//                 {
//                     "id": "8de402c1",
//                     "type": "task"
//                 },
//                 {
//                     "id": "8f20d98e",
//                     "type": "data"
//                 },
//                 {
//                     "id": "69c523b6",
//                     "type": "task"
//                 },
//                 {
//                     "id": "4f7ffa1b",
//                     "type": "data"
//                 }
//             ]
//         },
//         "reporting": {
//             "id": "reporting",
//             "name": "reporting",
//             "inputs": [
//                 "9f266f06",
//                 "1e3cc50a"
//             ],
//             "outputs": [
//                 "8838ca1f",
//                 "d0e9b00f",
//                 "3b199c6b",
//                 "c6992660",
//                 "eb7d6d28"
//             ],
//             "children": [
//                 {
//                     "id": "c7646ea1",
//                     "type": "task"
//                 },
//                 {
//                     "id": "be6b7919",
//                     "type": "task"
//                 },
//                 {
//                     "id": "40886786",
//                     "type": "task"
//                 },
//                 {
//                     "id": "d0e9b00f",
//                     "type": "data"
//                 },
//                 {
//                     "id": "c6992660",
//                     "type": "data"
//                 },
//                 {
//                     "id": "3fb71518",
//                     "type": "task"
//                 },
//                 {
//                     "id": "4adb5c8b",
//                     "type": "task"
//                 },
//                 {
//                     "id": "8838ca1f",
//                     "type": "data"
//                 },
//                 {
//                     "id": "3b199c6b",
//                     "type": "data"
//                 },
//                 {
//                     "id": "eb7d6d28",
//                     "type": "data"
//                 }
//             ]
//         },
//         "train_evaluation.linear_regression": {
//             "id": "train_evaluation.linear_regression",
//             "name": "train_evaluation.linear_regression",
//             "inputs": [
//                 "98eb115e",
//                 "9ca016a8",
//                 "cae2d1c7",
//                 "f6d9538c",
//                 "872981f9"
//             ],
//             "outputs": [
//                 "495a0bbc",
//                 "b701864d"
//             ],
//             "children": [
//                 {
//                     "id": "b701864d",
//                     "type": "data"
//                 },
//                 {
//                     "id": "495a0bbc",
//                     "type": "data"
//                 },
//                 {
//                     "id": "848e88da",
//                     "type": "task"
//                 },
//                 {
//                     "id": "d6a09df8",
//                     "type": "task"
//                 },
//                 {
//                     "id": "10e51dea",
//                     "type": "data"
//                 }
//             ]
//         },
//         "train_evaluation": {
//             "id": "train_evaluation",
//             "name": "train_evaluation",
//             "inputs": [
//                 "72baf5c6",
//                 "98eb115e",
//                 "9ca016a8",
//                 "cae2d1c7",
//                 "f6d9538c",
//                 "872981f9"
//             ],
//             "outputs": [
//                 "495a0bbc",
//                 "b16095d0",
//                 "b701864d",
//                 "4f79de77"
//             ],
//             "children": [
//                 {
//                     "id": "train_evaluation.random_forest",
//                     "type": "modularPipeline"
//                 },
//                 {
//                     "id": "train_evaluation.linear_regression",
//                     "type": "modularPipeline"
//                 }
//             ]
//         },
//         "train_evaluation.random_forest": {
//             "id": "train_evaluation.random_forest",
//             "name": "train_evaluation.random_forest",
//             "inputs": [
//                 "72baf5c6",
//                 "9ca016a8",
//                 "cae2d1c7",
//                 "f6d9538c",
//                 "872981f9"
//             ],
//             "outputs": [
//                 "b16095d0",
//                 "4f79de77"
//             ],
//             "children": [
//                 {
//                     "id": "01675921",
//                     "type": "data"
//                 },
//                 {
//                     "id": "1c0614b4",
//                     "type": "task"
//                 },
//                 {
//                     "id": "4f79de77",
//                     "type": "data"
//                 },
//                 {
//                     "id": "b16095d0",
//                     "type": "data"
//                 },
//                 {
//                     "id": "0b70ae9d",
//                     "type": "task"
//                 }
//             ]
//         }
//     },
//     "selected_pipeline": "__default__"
// }


// TODO remove this mock
const dataMock = {
    "name": "flare",
    "children": [
        {
            "name": "analytics",
            "children": [
                {
                    "name": "cluster",
                    "children": [
                        {
                            "name": "AgglomerativeCluster",
                            "size": 3938,
                            "id": "flare.analytics.cluster.AgglomerativeCluster"
                        },
                        {
                            "name": "CommunityStructure",
                            "size": 3812,
                            "id": "flare.analytics.cluster.CommunityStructure"
                        },
                        {
                            "name": "HierarchicalCluster",
                            "size": 6714,
                            "id": "flare.analytics.cluster.HierarchicalCluster"
                        },
                        {
                            "name": "MergeEdge",
                            "size": 743,
                            "id": "flare.analytics.cluster.MergeEdge"
                        }
                    ],
                    "id": "flare.analytics.cluster"
                },
                {
                    "name": "graph",
                    "children": [
                        {
                            "name": "BetweennessCentrality",
                            "size": 3534,
                            "id": "flare.analytics.graph.BetweennessCentrality"
                        },
                        {
                            "name": "LinkDistance",
                            "size": 5731,
                            "id": "flare.analytics.graph.LinkDistance"
                        },
                        {
                            "name": "MaxFlowMinCut",
                            "size": 7840,
                            "id": "flare.analytics.graph.MaxFlowMinCut"
                        },
                        {
                            "name": "ShortestPaths",
                            "size": 5914,
                            "id": "flare.analytics.graph.ShortestPaths"
                        },
                        {
                            "name": "SpanningTree",
                            "size": 3416,
                            "id": "flare.analytics.graph.SpanningTree"
                        }
                    ],
                    "id": "flare.analytics.graph"
                },
                {
                    "name": "optimization",
                    "children": [
                        {
                            "name": "AspectRatioBanker",
                            "size": 7074,
                            "id": "flare.analytics.optimization.AspectRatioBanker"
                        }
                    ],
                    "id": "flare.analytics.optimization"
                }
            ],
            "id": "flare.analytics"
        },
        {
            "name": "animate",
            "children": [
                {
                    "name": "Easing",
                    "size": 17010,
                    "id": "flare.animate.Easing"
                },
                {
                    "name": "FunctionSequence",
                    "size": 5842,
                    "id": "flare.animate.FunctionSequence"
                },
                {
                    "name": "interpolate",
                    "children": [
                        {
                            "name": "ArrayInterpolator",
                            "size": 1983,
                            "id": "flare.animate.interpolate.ArrayInterpolator"
                        },
                        {
                            "name": "ColorInterpolator",
                            "size": 2047,
                            "id": "flare.animate.interpolate.ColorInterpolator"
                        },
                        {
                            "name": "DateInterpolator",
                            "size": 1375,
                            "id": "flare.animate.interpolate.DateInterpolator"
                        },
                        {
                            "name": "Interpolator",
                            "size": 8746,
                            "id": "flare.animate.interpolate.Interpolator"
                        },
                        {
                            "name": "MatrixInterpolator",
                            "size": 2202,
                            "id": "flare.animate.interpolate.MatrixInterpolator"
                        },
                        {
                            "name": "NumberInterpolator",
                            "size": 1382,
                            "id": "flare.animate.interpolate.NumberInterpolator"
                        },
                        {
                            "name": "ObjectInterpolator",
                            "size": 1629,
                            "id": "flare.animate.interpolate.ObjectInterpolator"
                        },
                        {
                            "name": "PointInterpolator",
                            "size": 1675,
                            "id": "flare.animate.interpolate.PointInterpolator"
                        },
                        {
                            "name": "RectangleInterpolator",
                            "size": 2042,
                            "id": "flare.animate.interpolate.RectangleInterpolator"
                        }
                    ],
                    "id": "flare.animate.interpolate"
                },
                {
                    "name": "ISchedulable",
                    "size": 1041,
                    "id": "flare.animate.ISchedulable"
                },
                {
                    "name": "Parallel",
                    "size": 5176,
                    "id": "flare.animate.Parallel"
                },
                {
                    "name": "Pause",
                    "size": 449,
                    "id": "flare.animate.Pause"
                },
                {
                    "name": "Scheduler",
                    "size": 5593,
                    "id": "flare.animate.Scheduler"
                },
                {
                    "name": "Sequence",
                    "size": 5534,
                    "id": "flare.animate.Sequence"
                },
                {
                    "name": "Transition",
                    "size": 9201,
                    "id": "flare.animate.Transition"
                },
                {
                    "name": "Transitioner",
                    "size": 19975,
                    "id": "flare.animate.Transitioner"
                },
                {
                    "name": "TransitionEvent",
                    "size": 1116,
                    "id": "flare.animate.TransitionEvent"
                },
                {
                    "name": "Tween",
                    "size": 6006,
                    "id": "flare.animate.Tween"
                }
            ],
            "id": "flare.animate"
        },
        {
            "name": "data",
            "children": [
                {
                    "name": "converters",
                    "children": [
                        {
                            "name": "Converters",
                            "size": 721,
                            "id": "flare.data.converters.Converters"
                        },
                        {
                            "name": "DelimitedTextConverter",
                            "size": 4294,
                            "id": "flare.data.converters.DelimitedTextConverter"
                        },
                        {
                            "name": "GraphMLConverter",
                            "size": 9800,
                            "id": "flare.data.converters.GraphMLConverter"
                        },
                        {
                            "name": "IDataConverter",
                            "size": 1314,
                            "id": "flare.data.converters.IDataConverter"
                        },
                        {
                            "name": "JSONConverter",
                            "size": 2220,
                            "id": "flare.data.converters.JSONConverter"
                        }
                    ],
                    "id": "flare.data.converters"
                },
                {
                    "name": "DataField",
                    "size": 1759,
                    "id": "flare.data.DataField"
                },
                {
                    "name": "DataSchema",
                    "size": 2165,
                    "id": "flare.data.DataSchema"
                },
                {
                    "name": "DataSet",
                    "size": 586,
                    "id": "flare.data.DataSet"
                },
                {
                    "name": "DataSource",
                    "size": 3331,
                    "id": "flare.data.DataSource"
                },
                {
                    "name": "DataTable",
                    "size": 772,
                    "id": "flare.data.DataTable"
                },
                {
                    "name": "DataUtil",
                    "size": 3322,
                    "id": "flare.data.DataUtil"
                }
            ],
            "id": "flare.data"
        },
        {
            "name": "display",
            "children": [
                {
                    "name": "DirtySprite",
                    "size": 8833,
                    "id": "flare.display.DirtySprite"
                },
                {
                    "name": "LineSprite",
                    "size": 1732,
                    "id": "flare.display.LineSprite"
                },
                {
                    "name": "RectSprite",
                    "size": 3623,
                    "id": "flare.display.RectSprite"
                },
                {
                    "name": "TextSprite",
                    "size": 10066,
                    "id": "flare.display.TextSprite"
                }
            ],
            "id": "flare.display"
        },
        {
            "name": "flex",
            "children": [
                {
                    "name": "FlareVis",
                    "size": 4116,
                    "id": "flare.flex.FlareVis"
                }
            ],
            "id": "flare.flex"
        },
        {
            "name": "physics",
            "children": [
                {
                    "name": "DragForce",
                    "size": 1082,
                    "id": "flare.physics.DragForce"
                },
                {
                    "name": "GravityForce",
                    "size": 1336,
                    "id": "flare.physics.GravityForce"
                },
                {
                    "name": "IForce",
                    "size": 319,
                    "id": "flare.physics.IForce"
                },
                {
                    "name": "NBodyForce",
                    "size": 10498,
                    "id": "flare.physics.NBodyForce"
                },
                {
                    "name": "Particle",
                    "size": 2822,
                    "id": "flare.physics.Particle"
                },
                {
                    "name": "Simulation",
                    "size": 9983,
                    "id": "flare.physics.Simulation"
                },
                {
                    "name": "Spring",
                    "size": 2213,
                    "id": "flare.physics.Spring"
                },
                {
                    "name": "SpringForce",
                    "size": 1681,
                    "id": "flare.physics.SpringForce"
                }
            ],
            "id": "flare.physics"
        },
        {
            "name": "query",
            "children": [
                {
                    "name": "AggregateExpression",
                    "size": 1616,
                    "id": "flare.query.AggregateExpression"
                },
                {
                    "name": "And",
                    "size": 1027,
                    "id": "flare.query.And"
                },
                {
                    "name": "Arithmetic",
                    "size": 3891,
                    "id": "flare.query.Arithmetic"
                },
                {
                    "name": "Average",
                    "size": 891,
                    "id": "flare.query.Average"
                },
                {
                    "name": "BinaryExpression",
                    "size": 2893,
                    "id": "flare.query.BinaryExpression"
                },
                {
                    "name": "Comparison",
                    "size": 5103,
                    "id": "flare.query.Comparison"
                },
                {
                    "name": "CompositeExpression",
                    "size": 3677,
                    "id": "flare.query.CompositeExpression"
                },
                {
                    "name": "Count",
                    "size": 781,
                    "id": "flare.query.Count"
                },
                {
                    "name": "DateUtil",
                    "size": 4141,
                    "id": "flare.query.DateUtil"
                },
                {
                    "name": "Distinct",
                    "size": 933,
                    "id": "flare.query.Distinct"
                },
                {
                    "name": "Expression",
                    "size": 5130,
                    "id": "flare.query.Expression"
                },
                {
                    "name": "ExpressionIterator",
                    "size": 3617,
                    "id": "flare.query.ExpressionIterator"
                },
                {
                    "name": "Fn",
                    "size": 3240,
                    "id": "flare.query.Fn"
                },
                {
                    "name": "If",
                    "size": 2732,
                    "id": "flare.query.If"
                },
                {
                    "name": "IsA",
                    "size": 2039,
                    "id": "flare.query.IsA"
                },
                {
                    "name": "Literal",
                    "size": 1214,
                    "id": "flare.query.Literal"
                },
                {
                    "name": "Match",
                    "size": 3748,
                    "id": "flare.query.Match"
                },
                {
                    "name": "Maximum",
                    "size": 843,
                    "id": "flare.query.Maximum"
                },
                {
                    "name": "methods",
                    "children": [
                        {
                            "name": "add",
                            "size": 593,
                            "id": "flare.query.methods.add"
                        },
                        {
                            "name": "and",
                            "size": 330,
                            "id": "flare.query.methods.and"
                        },
                        {
                            "name": "average",
                            "size": 287,
                            "id": "flare.query.methods.average"
                        },
                        {
                            "name": "count",
                            "size": 277,
                            "id": "flare.query.methods.count"
                        },
                        {
                            "name": "distinct",
                            "size": 292,
                            "id": "flare.query.methods.distinct"
                        },
                        {
                            "name": "div",
                            "size": 595,
                            "id": "flare.query.methods.div"
                        },
                        {
                            "name": "eq",
                            "size": 594,
                            "id": "flare.query.methods.eq"
                        },
                        {
                            "name": "fn",
                            "size": 460,
                            "id": "flare.query.methods.fn"
                        },
                        {
                            "name": "gt",
                            "size": 603,
                            "id": "flare.query.methods.gt"
                        },
                        {
                            "name": "gte",
                            "size": 625,
                            "id": "flare.query.methods.gte"
                        },
                        {
                            "name": "iff",
                            "size": 748,
                            "id": "flare.query.methods.iff"
                        },
                        {
                            "name": "isa",
                            "size": 461,
                            "id": "flare.query.methods.isa"
                        },
                        {
                            "name": "lt",
                            "size": 597,
                            "id": "flare.query.methods.lt"
                        },
                        {
                            "name": "lte",
                            "size": 619,
                            "id": "flare.query.methods.lte"
                        },
                        {
                            "name": "max",
                            "size": 283,
                            "id": "flare.query.methods.max"
                        },
                        {
                            "name": "min",
                            "size": 283,
                            "id": "flare.query.methods.min"
                        },
                        {
                            "name": "mod",
                            "size": 591,
                            "id": "flare.query.methods.mod"
                        },
                        {
                            "name": "mul",
                            "size": 603,
                            "id": "flare.query.methods.mul"
                        },
                        {
                            "name": "neq",
                            "size": 599,
                            "id": "flare.query.methods.neq"
                        },
                        {
                            "name": "not",
                            "size": 386,
                            "id": "flare.query.methods.not"
                        },
                        {
                            "name": "or",
                            "size": 323,
                            "id": "flare.query.methods.or"
                        },
                        {
                            "name": "orderby",
                            "size": 307,
                            "id": "flare.query.methods.orderby"
                        },
                        {
                            "name": "range",
                            "size": 772,
                            "id": "flare.query.methods.range"
                        },
                        {
                            "name": "select",
                            "size": 296,
                            "id": "flare.query.methods.select"
                        },
                        {
                            "name": "stddev",
                            "size": 363,
                            "id": "flare.query.methods.stddev"
                        },
                        {
                            "name": "sub",
                            "size": 600,
                            "id": "flare.query.methods.sub"
                        },
                        {
                            "name": "sum",
                            "size": 280,
                            "id": "flare.query.methods.sum"
                        },
                        {
                            "name": "update",
                            "size": 307,
                            "id": "flare.query.methods.update"
                        },
                        {
                            "name": "variance",
                            "size": 335,
                            "id": "flare.query.methods.variance"
                        },
                        {
                            "name": "where",
                            "size": 299,
                            "id": "flare.query.methods.where"
                        },
                        {
                            "name": "xor",
                            "size": 354,
                            "id": "flare.query.methods.xor"
                        },
                        {
                            "name": "_",
                            "size": 264,
                            "id": "flare.query.methods._"
                        }
                    ],
                    "id": "flare.query.methods"
                },
                {
                    "name": "Minimum",
                    "size": 843,
                    "id": "flare.query.Minimum"
                },
                {
                    "name": "Not",
                    "size": 1554,
                    "id": "flare.query.Not"
                },
                {
                    "name": "Or",
                    "size": 970,
                    "id": "flare.query.Or"
                },
                {
                    "name": "Query",
                    "size": 13896,
                    "id": "flare.query.Query"
                },
                {
                    "name": "Range",
                    "size": 1594,
                    "id": "flare.query.Range"
                },
                {
                    "name": "StringUtil",
                    "size": 4130,
                    "id": "flare.query.StringUtil"
                },
                {
                    "name": "Sum",
                    "size": 791,
                    "id": "flare.query.Sum"
                },
                {
                    "name": "Variable",
                    "size": 1124,
                    "id": "flare.query.Variable"
                },
                {
                    "name": "Variance",
                    "size": 1876,
                    "id": "flare.query.Variance"
                },
                {
                    "name": "Xor",
                    "size": 1101,
                    "id": "flare.query.Xor"
                }
            ],
            "id": "flare.query"
        },
        {
            "name": "scale",
            "children": [
                {
                    "name": "IScaleMap",
                    "size": 2105,
                    "id": "flare.scale.IScaleMap"
                },
                {
                    "name": "LinearScale",
                    "size": 1316,
                    "id": "flare.scale.LinearScale"
                },
                {
                    "name": "LogScale",
                    "size": 3151,
                    "id": "flare.scale.LogScale"
                },
                {
                    "name": "OrdinalScale",
                    "size": 3770,
                    "id": "flare.scale.OrdinalScale"
                },
                {
                    "name": "QuantileScale",
                    "size": 2435,
                    "id": "flare.scale.QuantileScale"
                },
                {
                    "name": "QuantitativeScale",
                    "size": 4839,
                    "id": "flare.scale.QuantitativeScale"
                },
                {
                    "name": "RootScale",
                    "size": 1756,
                    "id": "flare.scale.RootScale"
                },
                {
                    "name": "Scale",
                    "size": 4268,
                    "id": "flare.scale.Scale"
                },
                {
                    "name": "ScaleType",
                    "size": 1821,
                    "id": "flare.scale.ScaleType"
                },
                {
                    "name": "TimeScale",
                    "size": 5833,
                    "id": "flare.scale.TimeScale"
                }
            ],
            "id": "flare.scale"
        },
        {
            "name": "util",
            "children": [
                {
                    "name": "Arrays",
                    "size": 8258,
                    "id": "flare.util.Arrays"
                },
                {
                    "name": "Colors",
                    "size": 10001,
                    "id": "flare.util.Colors"
                },
                {
                    "name": "Dates",
                    "size": 8217,
                    "id": "flare.util.Dates"
                },
                {
                    "name": "Displays",
                    "size": 12555,
                    "id": "flare.util.Displays"
                },
                {
                    "name": "Filter",
                    "size": 2324,
                    "id": "flare.util.Filter"
                },
                {
                    "name": "Geometry",
                    "size": 10993,
                    "id": "flare.util.Geometry"
                },
                {
                    "name": "heap",
                    "children": [
                        {
                            "name": "FibonacciHeap",
                            "size": 9354,
                            "id": "flare.util.heap.FibonacciHeap"
                        },
                        {
                            "name": "HeapNode",
                            "size": 1233,
                            "id": "flare.util.heap.HeapNode"
                        }
                    ],
                    "id": "flare.util.heap"
                },
                {
                    "name": "IEvaluable",
                    "size": 335,
                    "id": "flare.util.IEvaluable"
                },
                {
                    "name": "IPredicate",
                    "size": 383,
                    "id": "flare.util.IPredicate"
                },
                {
                    "name": "IValueProxy",
                    "size": 874,
                    "id": "flare.util.IValueProxy"
                },
                {
                    "name": "math",
                    "children": [
                        {
                            "name": "DenseMatrix",
                            "size": 3165,
                            "id": "flare.util.math.DenseMatrix"
                        },
                        {
                            "name": "IMatrix",
                            "size": 2815,
                            "id": "flare.util.math.IMatrix"
                        },
                        {
                            "name": "SparseMatrix",
                            "size": 3366,
                            "id": "flare.util.math.SparseMatrix"
                        }
                    ],
                    "id": "flare.util.math"
                },
                {
                    "name": "Maths",
                    "size": 17705,
                    "id": "flare.util.Maths"
                },
                {
                    "name": "Orientation",
                    "size": 1486,
                    "id": "flare.util.Orientation"
                },
                {
                    "name": "palette",
                    "children": [
                        {
                            "name": "ColorPalette",
                            "size": 6367,
                            "id": "flare.util.palette.ColorPalette"
                        },
                        {
                            "name": "Palette",
                            "size": 1229,
                            "id": "flare.util.palette.Palette"
                        },
                        {
                            "name": "ShapePalette",
                            "size": 2059,
                            "id": "flare.util.palette.ShapePalette"
                        },
                        {
                            "name": "SizePalette",
                            "size": 2291,
                            "id": "flare.util.palette.SizePalette"
                        }
                    ],
                    "id": "flare.util.palette"
                },
                {
                    "name": "Property",
                    "size": 5559,
                    "id": "flare.util.Property"
                },
                {
                    "name": "Shapes",
                    "size": 19118,
                    "id": "flare.util.Shapes"
                },
                {
                    "name": "Sort",
                    "size": 6887,
                    "id": "flare.util.Sort"
                },
                {
                    "name": "Stats",
                    "size": 6557,
                    "id": "flare.util.Stats"
                },
                {
                    "name": "Strings",
                    "size": 22026,
                    "id": "flare.util.Strings"
                }
            ],
            "id": "flare.util"
        },
        {
            "name": "vis",
            "children": [
                {
                    "name": "axis",
                    "children": [
                        {
                            "name": "Axes",
                            "size": 1302,
                            "id": "flare.vis.axis.Axes"
                        },
                        {
                            "name": "Axis",
                            "size": 24593,
                            "id": "flare.vis.axis.Axis"
                        },
                        {
                            "name": "AxisGridLine",
                            "size": 652,
                            "id": "flare.vis.axis.AxisGridLine"
                        },
                        {
                            "name": "AxisLabel",
                            "size": 636,
                            "id": "flare.vis.axis.AxisLabel"
                        },
                        {
                            "name": "CartesianAxes",
                            "size": 6703,
                            "id": "flare.vis.axis.CartesianAxes"
                        }
                    ],
                    "id": "flare.vis.axis"
                },
                {
                    "name": "controls",
                    "children": [
                        {
                            "name": "AnchorControl",
                            "size": 2138,
                            "id": "flare.vis.controls.AnchorControl"
                        },
                        {
                            "name": "ClickControl",
                            "size": 3824,
                            "id": "flare.vis.controls.ClickControl"
                        },
                        {
                            "name": "Control",
                            "size": 1353,
                            "id": "flare.vis.controls.Control"
                        },
                        {
                            "name": "ControlList",
                            "size": 4665,
                            "id": "flare.vis.controls.ControlList"
                        },
                        {
                            "name": "DragControl",
                            "size": 2649,
                            "id": "flare.vis.controls.DragControl"
                        },
                        {
                            "name": "ExpandControl",
                            "size": 2832,
                            "id": "flare.vis.controls.ExpandControl"
                        },
                        {
                            "name": "HoverControl",
                            "size": 4896,
                            "id": "flare.vis.controls.HoverControl"
                        },
                        {
                            "name": "IControl",
                            "size": 763,
                            "id": "flare.vis.controls.IControl"
                        },
                        {
                            "name": "PanZoomControl",
                            "size": 5222,
                            "id": "flare.vis.controls.PanZoomControl"
                        },
                        {
                            "name": "SelectionControl",
                            "size": 7862,
                            "id": "flare.vis.controls.SelectionControl"
                        },
                        {
                            "name": "TooltipControl",
                            "size": 8435,
                            "id": "flare.vis.controls.TooltipControl"
                        }
                    ],
                    "id": "flare.vis.controls"
                },
                {
                    "name": "data",
                    "children": [
                        {
                            "name": "Data",
                            "size": 20544,
                            "id": "flare.vis.data.Data"
                        },
                        {
                            "name": "DataList",
                            "size": 19788,
                            "id": "flare.vis.data.DataList"
                        },
                        {
                            "name": "DataSprite",
                            "size": 10349,
                            "id": "flare.vis.data.DataSprite"
                        },
                        {
                            "name": "EdgeSprite",
                            "size": 3301,
                            "id": "flare.vis.data.EdgeSprite"
                        },
                        {
                            "name": "NodeSprite",
                            "size": 19382,
                            "id": "flare.vis.data.NodeSprite"
                        },
                        {
                            "name": "render",
                            "children": [
                                {
                                    "name": "ArrowType",
                                    "size": 698,
                                    "id": "flare.vis.data.render.ArrowType"
                                },
                                {
                                    "name": "EdgeRenderer",
                                    "size": 5569,
                                    "id": "flare.vis.data.render.EdgeRenderer"
                                },
                                {
                                    "name": "IRenderer",
                                    "size": 353,
                                    "id": "flare.vis.data.render.IRenderer"
                                },
                                {
                                    "name": "ShapeRenderer",
                                    "size": 2247,
                                    "id": "flare.vis.data.render.ShapeRenderer"
                                }
                            ],
                            "id": "flare.vis.data.render"
                        },
                        {
                            "name": "ScaleBinding",
                            "size": 11275,
                            "id": "flare.vis.data.ScaleBinding"
                        },
                        {
                            "name": "Tree",
                            "size": 7147,
                            "id": "flare.vis.data.Tree"
                        },
                        {
                            "name": "TreeBuilder",
                            "size": 9930,
                            "id": "flare.vis.data.TreeBuilder"
                        }
                    ],
                    "id": "flare.vis.data"
                },
                {
                    "name": "events",
                    "children": [
                        {
                            "name": "DataEvent",
                            "size": 2313,
                            "id": "flare.vis.events.DataEvent"
                        },
                        {
                            "name": "SelectionEvent",
                            "size": 1880,
                            "id": "flare.vis.events.SelectionEvent"
                        },
                        {
                            "name": "TooltipEvent",
                            "size": 1701,
                            "id": "flare.vis.events.TooltipEvent"
                        },
                        {
                            "name": "VisualizationEvent",
                            "size": 1117,
                            "id": "flare.vis.events.VisualizationEvent"
                        }
                    ],
                    "id": "flare.vis.events"
                },
                {
                    "name": "legend",
                    "children": [
                        {
                            "name": "Legend",
                            "size": 20859,
                            "id": "flare.vis.legend.Legend"
                        },
                        {
                            "name": "LegendItem",
                            "size": 4614,
                            "id": "flare.vis.legend.LegendItem"
                        },
                        {
                            "name": "LegendRange",
                            "size": 10530,
                            "id": "flare.vis.legend.LegendRange"
                        }
                    ],
                    "id": "flare.vis.legend"
                },
                {
                    "name": "operator",
                    "children": [
                        {
                            "name": "distortion",
                            "children": [
                                {
                                    "name": "BifocalDistortion",
                                    "size": 4461,
                                    "id": "flare.vis.operator.distortion.BifocalDistortion"
                                },
                                {
                                    "name": "Distortion",
                                    "size": 6314,
                                    "id": "flare.vis.operator.distortion.Distortion"
                                },
                                {
                                    "name": "FisheyeDistortion",
                                    "size": 3444,
                                    "id": "flare.vis.operator.distortion.FisheyeDistortion"
                                }
                            ],
                            "id": "flare.vis.operator.distortion"
                        },
                        {
                            "name": "encoder",
                            "children": [
                                {
                                    "name": "ColorEncoder",
                                    "size": 3179,
                                    "id": "flare.vis.operator.encoder.ColorEncoder"
                                },
                                {
                                    "name": "Encoder",
                                    "size": 4060,
                                    "id": "flare.vis.operator.encoder.Encoder"
                                },
                                {
                                    "name": "PropertyEncoder",
                                    "size": 4138,
                                    "id": "flare.vis.operator.encoder.PropertyEncoder"
                                },
                                {
                                    "name": "ShapeEncoder",
                                    "size": 1690,
                                    "id": "flare.vis.operator.encoder.ShapeEncoder"
                                },
                                {
                                    "name": "SizeEncoder",
                                    "size": 1830,
                                    "id": "flare.vis.operator.encoder.SizeEncoder"
                                }
                            ],
                            "id": "flare.vis.operator.encoder"
                        },
                        {
                            "name": "filter",
                            "children": [
                                {
                                    "name": "FisheyeTreeFilter",
                                    "size": 5219,
                                    "id": "flare.vis.operator.filter.FisheyeTreeFilter"
                                },
                                {
                                    "name": "GraphDistanceFilter",
                                    "size": 3165,
                                    "id": "flare.vis.operator.filter.GraphDistanceFilter"
                                },
                                {
                                    "name": "VisibilityFilter",
                                    "size": 3509,
                                    "id": "flare.vis.operator.filter.VisibilityFilter"
                                }
                            ],
                            "id": "flare.vis.operator.filter"
                        },
                        {
                            "name": "IOperator",
                            "size": 1286,
                            "id": "flare.vis.operator.IOperator"
                        },
                        {
                            "name": "label",
                            "children": [
                                {
                                    "name": "Labeler",
                                    "size": 9956,
                                    "id": "flare.vis.operator.label.Labeler"
                                },
                                {
                                    "name": "RadialLabeler",
                                    "size": 3899,
                                    "id": "flare.vis.operator.label.RadialLabeler"
                                },
                                {
                                    "name": "StackedAreaLabeler",
                                    "size": 3202,
                                    "id": "flare.vis.operator.label.StackedAreaLabeler"
                                }
                            ],
                            "id": "flare.vis.operator.label"
                        },
                        {
                            "name": "layout",
                            "children": [
                                {
                                    "name": "AxisLayout",
                                    "size": 6725,
                                    "id": "flare.vis.operator.layout.AxisLayout"
                                },
                                {
                                    "name": "BundledEdgeRouter",
                                    "size": 3727,
                                    "id": "flare.vis.operator.layout.BundledEdgeRouter"
                                },
                                {
                                    "name": "CircleLayout",
                                    "size": 9317,
                                    "id": "flare.vis.operator.layout.CircleLayout"
                                },
                                {
                                    "name": "CirclePackingLayout",
                                    "size": 12003,
                                    "id": "flare.vis.operator.layout.CirclePackingLayout"
                                },
                                {
                                    "name": "DendrogramLayout",
                                    "size": 4853,
                                    "id": "flare.vis.operator.layout.DendrogramLayout"
                                },
                                {
                                    "name": "ForceDirectedLayout",
                                    "size": 8411,
                                    "id": "flare.vis.operator.layout.ForceDirectedLayout"
                                },
                                {
                                    "name": "IcicleTreeLayout",
                                    "size": 4864,
                                    "id": "flare.vis.operator.layout.IcicleTreeLayout"
                                },
                                {
                                    "name": "IndentedTreeLayout",
                                    "size": 3174,
                                    "id": "flare.vis.operator.layout.IndentedTreeLayout"
                                },
                                {
                                    "name": "Layout",
                                    "size": 7881,
                                    "id": "flare.vis.operator.layout.Layout"
                                },
                                {
                                    "name": "NodeLinkTreeLayout",
                                    "size": 12870,
                                    "id": "flare.vis.operator.layout.NodeLinkTreeLayout"
                                },
                                {
                                    "name": "PieLayout",
                                    "size": 2728,
                                    "id": "flare.vis.operator.layout.PieLayout"
                                },
                                {
                                    "name": "RadialTreeLayout",
                                    "size": 12348,
                                    "id": "flare.vis.operator.layout.RadialTreeLayout"
                                },
                                {
                                    "name": "RandomLayout",
                                    "size": 870,
                                    "id": "flare.vis.operator.layout.RandomLayout"
                                },
                                {
                                    "name": "StackedAreaLayout",
                                    "size": 9121,
                                    "id": "flare.vis.operator.layout.StackedAreaLayout"
                                },
                                {
                                    "name": "TreeMapLayout",
                                    "size": 9191,
                                    "id": "flare.vis.operator.layout.TreeMapLayout"
                                }
                            ],
                            "id": "flare.vis.operator.layout"
                        },
                        {
                            "name": "Operator",
                            "size": 2490,
                            "id": "flare.vis.operator.Operator"
                        },
                        {
                            "name": "OperatorList",
                            "size": 5248,
                            "id": "flare.vis.operator.OperatorList"
                        },
                        {
                            "name": "OperatorSequence",
                            "size": 4190,
                            "id": "flare.vis.operator.OperatorSequence"
                        },
                        {
                            "name": "OperatorSwitch",
                            "size": 2581,
                            "id": "flare.vis.operator.OperatorSwitch"
                        },
                        {
                            "name": "SortOperator",
                            "size": 2023,
                            "id": "flare.vis.operator.SortOperator"
                        }
                    ],
                    "id": "flare.vis.operator"
                },
                {
                    "name": "Visualization",
                    "size": 16540,
                    "id": "flare.vis.Visualization"
                }
            ],
            "id": "flare.vis"
        }
    ],
    "id": "flare"
}

export type TreeLayout = "cartesian" | "polar";
export type TreeOrientation = "horizontal" | "vertical";
export type LinkType = "diagonal" | "step" | "curve" | "line" | "elbow";

interface FlowHierarchyProps {
    lineageNode: LineageNode[]
}

export interface sourceType {
    children: sourceType[];
    data: { name: string, children: sourceType, id: string, x0: number, y0: number };
    depth: number;
    height: number;
    parent: sourceType | null;
    x: number;
    y: number;
}

const FlowHierarchy: React.FC<FlowHierarchyProps> = ({ lineageNode }) => {
    const [expandedNodeKeys, setExpandedNodeKeys] = useState<
        Array<string | number>
    >([]);

    // TODO set it in props
    const nodeId = (d: any) => d.id;
    const renderNode = (node: NodeType, onClick: () => any) => {
        return (
            <Node node={node} onClick={onClick} width={192} height={24} />
        )
    }
    const data = dataMock;
    const margin = {
        top: 48, // do not overlap zoom controls by default
        left: 24,
        right: 24,
        bottom: 24
    }
    const nodeWidth = 192 * 1.5
    const nodeHeight = 24 + 16
    const width = 1200 // TODO check the <ParentSize> component
    const height = 800 // TODO check the <ParentSize> component
    //------------------

    const [layout, setLayout] = useState<TreeLayout>("cartesian");
    const [orientation, setOrientation] = useState<TreeOrientation>("horizontal");
    const [linkType, setLinkType] = useState<LinkType>("step");
    const [stepPercent, setStepPercent] = useState<number>(0.5);
    const [layoutSize, setLayoutSize] = useState<"node" | "layout">("node");

    const root = hierarchy(data, (d: any) =>
        expandedNodeKeys.includes(nodeId(d)) ? d.children : null
    );

    let origin: { x: number; y: number };
    let size: [number, number];
    let nodeSize: [number, number] | undefined;

    if (layout === "polar") {
        origin = {
            x: innerWidth / 2 + margin.left,
            y: innerHeight / 2 + margin.top
        };
        size = [2 * Math.PI, Math.min(innerWidth, innerHeight) / 2];
    } else {
        origin = { x: margin.left, y: margin.top };
        if (orientation === "vertical") {
            size = [innerWidth, innerHeight];
            nodeSize =
                layoutSize === "node" && nodeWidth && nodeHeight
                    ? [nodeWidth, nodeHeight]
                    : undefined;
        } else {
            size = [innerHeight, innerWidth];
            nodeSize =
                layoutSize === "node" && nodeWidth && nodeHeight
                    ? [nodeHeight, nodeWidth]
                    : undefined;
        }
    }

    const initialTransform = {
        scaleX: 1,
        scaleY: 1,
        translateX: orientation === "vertical" ? innerWidth / 2 : origin.x,
        translateY: orientation === "vertical" ? origin.y : innerHeight / 2,
        skewX: 0,
        skewY: 0
    };

    return (
        <div>
            <Box
                position="relative"
                bgcolor="rgba(0,0,0,0.05)"
                border={1}
                borderColor="rgba(0,0,0,.1)"
            >
                <Zoom
                    width={width}
                    height={height}
                    scaleXMin={1 / 4}
                    scaleXMax={4}
                    scaleYMin={1 / 4}
                    scaleYMax={4}
                    initialTransformMatrix={initialTransform}
                >
                    {(zoom: any) => (
                        <>
                            <svg
                                width={width}
                                height={height}
                                style={{ cursor: zoom.isDragging ? "grabbing" : "grab" }}
                            >
                                <Tree
                                    root={root}
                                    size={size}
                                    nodeSize={nodeSize}
                                // separation={(a: any, b: any) =>
                                //   (a.parent == b.parent ? 1 : 0.5) / a.depth
                                // }
                                >
                                    {(tree: any) => {
                                        return (
                                            <>
                                                <rect
                                                    width={width}
                                                    height={height}
                                                    fill="transparent"
                                                    onWheel={(event) => {
                                                        event.preventDefault();
                                                        // zoom.handleWheel(event);
                                                    }}
                                                    onMouseDown={zoom.dragStart}
                                                    onMouseMove={zoom.dragMove}
                                                    onMouseUp={zoom.dragEnd}
                                                    onMouseLeave={() => {
                                                        if (!zoom.isDragging) return;
                                                        zoom.dragEnd();
                                                    }}
                                                    onDoubleClick={(event) => {
                                                        if (event.altKey) {
                                                            const point = localPoint(event);
                                                            zoom.scale({ scaleX: 0.5, scaleY: 0.5, point });
                                                        } else {
                                                            const point = localPoint(event);
                                                            zoom.scale({ scaleX: 2.0, scaleY: 2.0, point });
                                                        }
                                                    }}
                                                />

                                                <Group
                                                    // top={origin.y}
                                                    // left={origin.x}
                                                    transform={zoom.toString()}
                                                >
                                                    <AnimatedLinks
                                                        links={tree.links()}
                                                        nodeId={nodeId}
                                                        linkType={linkType}
                                                        layout={layout}
                                                        orientation={orientation}
                                                        stepPercent={stepPercent}
                                                        stroke="#ccc"
                                                    />
                                                    <AnimatedNodes
                                                        nodes={tree.descendants().reverse()} // render parents on top of children
                                                        nodeId={nodeId}
                                                        layout={layout}
                                                        orientation={orientation}
                                                        renderNode={renderNode}
                                                        onNodeClick={(node) => {
                                                            const nodeKey = nodeId(node.data);
                                                            const isExpanded = expandedNodeKeys.includes(
                                                                nodeKey
                                                            );
                                                            if (isExpanded) {
                                                                setExpandedNodeKeys((prevState) =>
                                                                    prevState.filter((key) => key !== nodeKey)
                                                                );
                                                            } else {
                                                                // Probably not good to edit the node directly
                                                                node.data.x0 = node.x;
                                                                node.data.y0 = node.y;

                                                                setExpandedNodeKeys((prevState) => [
                                                                    ...prevState,
                                                                    nodeKey
                                                                ]);
                                                            }
                                                        }}
                                                    />
                                                </Group>
                                            </>
                                        )
                                    }}
                                </Tree>
                            </svg>
                        </>
                    )}
                </Zoom>
            </Box>
        </div>
    )
}

export default FlowHierarchy