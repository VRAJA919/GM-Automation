const { test, expect } = require('@playwright/test');
const { getToken } = require('./webservice-check.spec');

function getPoiUrl(env) {
  if (env === 'GQ1') return 'https://gq1.road.com/wsapi/v4/poiGeofences/';
  if (env === 'Staging') return 'https://eu-staging.road.com/wsapi/v4/poiGeofences/';
  if (env === 'PROD') return 'https://eugm.road.com/wsapi/v4/poiGeofences/';
  throw new Error('Unknown environment: ' + env);
}

test('poiGeofences API for GQ1', async ({ request }) => {
  const token = await getToken(request, 'GQ1');
  const stackName = 'GQ1';
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
  const postResponse = await request.post(
    getPoiUrl('GQ1'),
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: postBody,
    }
  );
  const postResult = await postResponse.json();
  console.log('POST poiGeofences API GQ1 result:', JSON.stringify(postResult, null, 2));
  expect(postResponse.ok()).toBeTruthy();

  // GET to verify creation
  const getResponse = await request.get(
    getPoiUrl('GQ1'),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const getData = await getResponse.json();
  const created = getData.poiGeofences?.find(g => g.name === nameDescr);
  console.log('GET poiGeofences API GQ1 created:', JSON.stringify(created, null, 2));
  expect(created).toBeDefined();
  expect(getResponse.ok()).toBeTruthy();

  // DELETE the created geofence
  if (created && created.tId) {
    const deleteResponse = await request.delete(
      getPoiUrl('GQ1') + created.tId,
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
    console.log('DELETE poiGeofences API GQ1 result:', deleteResult);
    expect(deleteResponse.ok()).toBeTruthy();
  }
});

test('poiGeofences API for Staging', async ({ request }) => {
  const token = await getToken(request, 'Staging');
  const stackName = 'Staging';
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
  const postResponse = await request.post(
    getPoiUrl('Staging'),
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: postBody,
    }
  );
  const postResult = await postResponse.json();
  console.log('POST poiGeofences API Staging result:', JSON.stringify(postResult, null, 2));
  expect(postResponse.ok()).toBeTruthy();

  // GET to verify creation
  const getResponse = await request.get(
    getPoiUrl('Staging'),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const getData = await getResponse.json();
  const created = getData.poiGeofences?.find(g => g.name === nameDescr);
  console.log('GET poiGeofences API Staging created:', JSON.stringify(created, null, 2));
  expect(created).toBeDefined();
  expect(getResponse.ok()).toBeTruthy();

  // DELETE the created geofence
  if (created && created.tId) {
    const deleteResponse = await request.delete(
      getPoiUrl('Staging') + created.tId,
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
    console.log('DELETE poiGeofences API Staging result:', deleteResult);
    expect(deleteResponse.ok()).toBeTruthy();
  }
});

test('poiGeofences API for PROD', async ({ request }) => {
  const token = await getToken(request, 'PROD');
  const stackName = 'PROD';
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
  const postResponse = await request.post(
    getPoiUrl('PROD'),
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: postBody,
    }
  );
  const postResult = await postResponse.json();
  console.log('POST poiGeofences API PROD result:', JSON.stringify(postResult, null, 2));
  expect(postResponse.ok()).toBeTruthy();

  // GET to verify creation
  const getResponse = await request.get(
    getPoiUrl('PROD'),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const getData = await getResponse.json();
  const created = getData.poiGeofences?.find(g => g.name === nameDescr);
  console.log('GET poiGeofences API PROD created:', JSON.stringify(created, null, 2));
  expect(created).toBeDefined();
  expect(getResponse.ok()).toBeTruthy();

  // DELETE the created geofence
  if (created && created.tId) {
    const deleteResponse = await request.delete(
      getPoiUrl('PROD') + created.tId,
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
    console.log('DELETE poiGeofences API PROD result:', deleteResult);
    expect(deleteResponse.ok()).toBeTruthy();
  }
});
