const { test, expect } = require('@playwright/test');
const { getToken } = require('./webservice-check.spec');

function getEmployeeUrl(env) {
  if (env === 'GQ1') return 'https://gq1.road.com/wsapi/v4/employees';
  if (env === 'Staging') return 'https://eu-staging.road.com/wsapi/v4/employees';
  if (env === 'PROD') return 'https://eugm.road.com/wsapi/v4/employees';
  throw new Error('Unknown environment: ' + env);
}

async function runEmployeeTest(request, env) {
  const token = await getToken(request, env);
  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const timeStr = `${pad(now.getDate())}${pad(now.getMonth()+1)}${now.getFullYear()}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const timestamp = `${now.getTime()}`;
  const email = `Test${timestamp}@example.com`;
  const surname = `STACK${timestamp}`;
  const empId = `${timestamp}`;

  const postBody = {
    employees: [
      {
        uId: { emailAdrs: email },
        name: 'TEST',
        surname: surname,
        givenNames: 'JOE',
        empId: empId,
        descr: 'Delivery',
        inactive: false,
        contacts: {
          phones: [
            { type: 'business', value: '9876543210' },
            { type: 'home', value: '9876543211' },
            { type: 'mobile', value: '9876543211' }
          ],
          emails: [
            { type: 'personal', value: 'joesmith1@example.com' }
          ],
          homeAdrs: {
            adrsLine: '3764 Evergreen Drive',
            city: 'Fremont',
            state: 'CA',
            county: 'Alameda',
            postalCode: '94538',
            countryCode: 'US',
            formattedAdrs: '3764 Evergreen Drive, Fremont, CA, 94538, United States'
          }
        }
      }
    ]
  };

  // POST new employee
  const postResponse = await request.post(
    getEmployeeUrl(env),
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      data: postBody,
    }
  );
  const postResult = await postResponse.json();
  console.log(`POST employees API ${env} result:`, JSON.stringify(postResult, null, 2));
  expect(postResponse.ok()).toBeTruthy();

  // GET to verify creation
  const getResponse = await request.get(
    getEmployeeUrl(env),
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json',
      },
    }
  );
  const getData = await getResponse.json();
  // Find the created employee by email
  const created = getData.employees?.find(e => e.uId?.emailAdrs === email);
  console.log(`GET employees API ${env} created:`, JSON.stringify(created, null, 2));
  expect(created).toBeDefined();
  expect(getResponse.ok()).toBeTruthy();
}

test('employees API for GQ1', async ({ request }) => {
  await runEmployeeTest(request, 'GQ1');
});

test('employees API for Staging', async ({ request }) => {
  await runEmployeeTest(request, 'Staging');
});

test('employees API for PROD', async ({ request }) => {
  await runEmployeeTest(request, 'PROD');
});
