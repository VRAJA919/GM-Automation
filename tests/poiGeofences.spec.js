// ...existing code...
const { test, expect } = require('@playwright/test');
const { getToken } = require('./utils');

function getPoiUrl(env) {
  if (env === 'GQ1') return 'https://gq1.road.com/wsapi/v4/poiGeofences/';
  if (env === 'Staging') return 'https://eu-staging.road.com/wsapi/v4/poiGeofences/';
  if (env === 'PROD') return 'https://eugm.road.com/wsapi/v4/poiGeofences/';
  throw new Error('Unknown environment: ' + env);
}

async function runPoiTest(request, env) {
  const tokenObj = await getToken(request, env);
  const token = tokenObj.bearer || tokenObj;
  console.log(`Using token for ${env}:`, token);
  const stackName = env;
  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const timeStr = `${pad(now.getDate())}${pad(now.getMonth()+1)}${now.getFullYear()}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const nameDescr = `${stackName}_${timeStr}`;

  // POST new geofence
  const postBody = {
    poiGeofences: [
      {
        name: nameDescr,
        descr: nameDescr,
        loc: { lon: 7.5844, lat: 46.9629 },
        adrs: {
          adrsLine: 'LITTEWIL 247A',
          city: 'VECHIGEN',
          postalCode: '3068',
          countryCode: 'CH',
          formattedAdrs: 'LITTEWIL 247A,VECHIGEN,3068,CH',
        },
        category: 'Building (Blue)',
        fence: { circle: { radius: 300 } },
        fromDt: '2025-08-12T00:00:00+01:00',
        toDt: null,
      },
    ],
  };
  let postResult;
  try {
    const postHeaders = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    console.log(`POST headers for ${env}:`, postHeaders);
    const postResponse = await request.post(
      getPoiUrl(env),
      {
        headers: postHeaders,
        data: postBody,
      }
    );
    const rawText = await postResponse.text();
    console.log(`POST poiGeofences API ${env} raw response:`, rawText);
    try {
      postResult = JSON.parse(rawText);
      console.log(`POST poiGeofences API ${env} result:`, JSON.stringify(postResult, null, 2));
    } catch (err) {
      throw new Error(`POST response is not valid JSON for ${env}. See raw response above.`);
    }
    expect(postResponse.ok()).toBeTruthy();
  } catch (err) {
    console.error(`POST poiGeofences API ${env} error:`, err);
    throw err;
  }

  // GET to verify creation
  let created;
  try {
    const getResponse = await request.get(
      getPoiUrl(env),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const getData = await getResponse.json();
    created = getData.poiGeofences?.find(g => g.name === nameDescr);
    console.log(`GET poiGeofences API ${env} created:`, JSON.stringify(created, null, 2));
    expect(created).toBeDefined();
    expect(getResponse.ok()).toBeTruthy();
  } catch (err) {
    console.error(`GET poiGeofences API ${env} error:`, err);
    throw err;
  }

  // DELETE the created geofence
  if (created && created.tId) {
    try {
      const deleteResponse = await request.delete(
        getPoiUrl(env) + created.tId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let deleteResult;
      try {
        const text = await deleteResponse.text();
        deleteResult = text ? JSON.parse(text) : '[empty response]';
      } catch (e) {
        deleteResult = '[invalid or empty JSON]';
      }
      console.log(`DELETE poiGeofences API ${env} result:`, deleteResult);
      expect(deleteResponse.ok()).toBeTruthy();
    } catch (err) {
      console.error(`DELETE poiGeofences API ${env} error:`, err);
      throw err;
    }
  }
}

test('poiGeofences API for GQ1', async ({ request }) => {
  await runPoiTest(request, 'GQ1');
});

test('poiGeofences API for Staging', async ({ request }) => {
  await runPoiTest(request, 'Staging');
});

test('poiGeofences API for PROD', async ({ request }) => {
  await runPoiTest(request, 'PROD');
});

