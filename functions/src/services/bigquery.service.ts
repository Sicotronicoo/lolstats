/* eslint-disable max-len */
import * as functions from "firebase-functions";
import {BigQuery, Job, JobLoadMetadata, Query} from "@google-cloud/bigquery";

const bq = new BigQuery();

const pause = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const runQueryJob = async (job: Job, withResults = false) => {
  const awaitForJobStatus = async () => {
    const [result] = await job.getMetadata();
    if (result.status && result.status.state === "DONE") {
      if (result.status.errorResult) {
        throw new Error(
          result.status.errorResult.message ?
            result.status.errorResult.message :
            JSON.stringify(result.status.errorResult)
        );
      }
      functions.logger.info(result.statistics);
    } else {
      return null;
    }
    return withResults ? job.getQueryResults() : true;
  };
  for (let i = 0; i < 15 * 60 / 5; i++) {
    const result = await awaitForJobStatus();
    if (result) {
      return result;
    }
    await pause(Math.min(5000, 200 * i));
  }
  throw new Error("BigQuery job timeout");
};

export const queryLoadFile = async (datasetId: string, tableId: string, path: string, metadata: JobLoadMetadata ) => {
  const [job] = await bq
    .dataset(datasetId)
    .table(tableId)
    .load(path, metadata);

  if (job.jobReference && job.jobReference.jobId) {
    functions.logger.info("Jobs reference: " + job.jobReference.jobId);
    const jobRef = bq.job(job.jobReference.jobId, {
      projectId: job.jobReference.projectId,
      location: job.jobReference.location,
      jobId: job.jobReference.jobId,
    });
    await runQueryJob(jobRef);
  }
};

export const createQueryJob = async (options: Query) => {
  const [job] = await bq.createQueryJob(options);
  await runQueryJob(job);
  const [result] = await job.getQueryResults();
  return JSON.parse(JSON.stringify(result));
};
