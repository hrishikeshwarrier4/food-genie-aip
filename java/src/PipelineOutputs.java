package com.palantir.eddie.export;

import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;

/**
 * FoodGenie Pipeline Outputs
 * ==========================
 * Container for the four output datasets produced by the FoodGenie Pipeline Builder.
 * Each output backs a corresponding Ontology object type.
 */
public final class PipelineOutputs {
    private final Dataset<Row> foodgenieTimetableObjectTypeBackingDatasource;
    private final Dataset<Row> foodgenieImagesObjectTypeBackingDatasource;
    private final Dataset<Row> foodgenieRoommatesBioObjectTypeBackingDatasource;
    private final Dataset<Row> foodgenieRoommatesObjectTypeBackingDatasource;

    public PipelineOutputs(
            Dataset<Row> foodgenieTimetableObjectTypeBackingDatasource,
            Dataset<Row> foodgenieImagesObjectTypeBackingDatasource,
            Dataset<Row> foodgenieRoommatesBioObjectTypeBackingDatasource,
            Dataset<Row> foodgenieRoommatesObjectTypeBackingDatasource) {
        this.foodgenieTimetableObjectTypeBackingDatasource = foodgenieTimetableObjectTypeBackingDatasource;
        this.foodgenieImagesObjectTypeBackingDatasource = foodgenieImagesObjectTypeBackingDatasource;
        this.foodgenieRoommatesBioObjectTypeBackingDatasource = foodgenieRoommatesBioObjectTypeBackingDatasource;
        this.foodgenieRoommatesObjectTypeBackingDatasource = foodgenieRoommatesObjectTypeBackingDatasource;
    }

    public Dataset<Row> foodgenieTimetableObjectTypeBackingDatasource() {
        return foodgenieTimetableObjectTypeBackingDatasource;
    }

    public Dataset<Row> foodgenieImagesObjectTypeBackingDatasource() {
        return foodgenieImagesObjectTypeBackingDatasource;
    }

    public Dataset<Row> foodgenieRoommatesBioObjectTypeBackingDatasource() {
        return foodgenieRoommatesBioObjectTypeBackingDatasource;
    }

    public Dataset<Row> foodgenieRoommatesObjectTypeBackingDatasource() {
        return foodgenieRoommatesObjectTypeBackingDatasource;
    }
}
