import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 1000,
  duration: '10s',
  ext: {
    loadimpact: {
      // The ID of the project to which the test is assigned in the k6 Cloud UI.
      // By default, tests are executed in default project.
      projectID: '',
      // The name of the test in the k6 Cloud UI.
      // Test runs with the same name will be grouped.
      name: 'script.js',
    },
  },
};

export default function () {
  http.get('http://host.docker.internal:3030/health');
  sleep(1);
}
