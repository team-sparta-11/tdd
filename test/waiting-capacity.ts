import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  scenarios: {
    waiting: {
      executor: 'constant-vus',
      vus: 500,
      duration: '10s',
      gracefulStop: '3s',
    },
  },
};

export default function () {
  const PROTOCAL = 'http';
  // use when run with docker
  const HOST = 'host.docker.internal';
  const PORT = '3001';
  const PATH = 'api/waiting/';
  const URL = `${PROTOCAL}://${HOST}:${PORT}/${PATH}`;
  const res = http.get(URL);

  check(res, { '200': (r) => r.status === 200 });

  sleep(1);
}
