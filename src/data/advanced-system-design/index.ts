import { Course } from "../types";
import { advancedConceptsModule } from "./01-advanced-concepts";
import { dynamoModule } from "./02-dynamo";
import { cassandraModule } from "./03-cassandra";
import { kafkaModule } from "./04-kafka";
import { gfsModule } from "./05-gfs";
import { distributedCacheModule } from "./06-distributed-cache";
import { searchEngineModule } from "./07-search-engine";
import { taskSchedulerModule } from "./08-task-scheduler";

export const advancedSystemDesignCourse: Course = {
  id: "advanced-system-design",
  slug: "advanced-system-design",
  title: "Advanced Distributed Systems Design",
  description: "Deep dive into distributed systems internals. Design Dynamo, Cassandra, Kafka, GFS, and more. Covers consensus, replication, partitioning, and fault tolerance.",
  icon: "⚙️",
  tier: "pro",
  modules: [advancedConceptsModule, dynamoModule, cassandraModule, kafkaModule, gfsModule, distributedCacheModule, searchEngineModule, taskSchedulerModule],
};
