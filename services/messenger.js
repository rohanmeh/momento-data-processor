import { getCacheClient, getTopicClient } from './momento.js';

const configure = async () => {
  const topicClient = await getTopicClient();
  await topicClient.subscribe('test-cache', 'test', {
    onItem: newData,
    onError: logSubscriptionError
  });

  console.log('Topic client configured');
};

const newData = async (data) => {
  console.log(data)
  const cacheClient = await getCacheClient();
  const result = await cacheClient.set('test-cache', 'test-key', data);
  console.log(result)
  console.log(JSON.parse(data._value).id, JSON.parse(data._value).value)
  const sensor_id = JSON.parse(data._value).id
  const sensor_value = JSON.parse(data._value).value
  const timestamp = new Date().getTime()
  const addToHistoryResponse = await cacheClient.sortedSetPutElement("test-cache", 
                                                                    `${sensor_id}-sensor-data`, 
                                                                    JSON.stringify({"sensor_value": sensor_value, "timestamp": timestamp}), 
                                                                    timestamp)
  console.log(addToHistoryResponse)
  const historyResponse = await cacheClient.sortedSetFetchByRank("test-cache", `${sensor_id}-sensor-data`)
  historyResponse.valueArray().map((element, rank) => {
    console.log(element.value)
  })
}

const logSubscriptionError = (data, subscription) => {
  console.error(`An error occurred with the a subscription: ${data.toString()}`);
};

export const Messenger = {
    configure
};