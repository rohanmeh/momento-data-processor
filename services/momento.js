import { CacheClient, TopicClient, EnvMomentoTokenProvider, Configurations } from '@gomomento/sdk';
import getSecret from './secrets.js';

let topicClient;
let cacheClient;

/**
 * Gets an initialized Momento Cache Client
 * 
 * @param {string[]} caches - array of cache names to initialize
 * @returns @type CacheClient
 */
export async function getCacheClient() {
  if (!cacheClient) {
    const authToken = await getSecret('MomentoCacheSecret');
    process.env.AUTH_TOKEN = authToken;
    const credentials = new EnvMomentoTokenProvider({ environmentVariableName: 'AUTH_TOKEN' });
    cacheClient = new CacheClient({
      configuration: Configurations.Laptop.v1(),
      credentialProvider: credentials,
      defaultTtlSeconds: 10000
    });
  }

  return cacheClient;
};

/**
 * Gets an initialized Momento Topic Client
 * 
 * @returns @type TopicClient
 */
export async function getTopicClient() {
  if(topicClient)
    return topicClient;
  const authToken = await getSecret('MomentoCacheSecret');
  process.env.AUTH_TOKEN = authToken;
  const credentials = new EnvMomentoTokenProvider({ environmentVariableName: 'AUTH_TOKEN' });

  topicClient = new TopicClient({
    configuration: Configurations.Laptop.v1(),
    credentialProvider: credentials
  });

  return topicClient;  
}