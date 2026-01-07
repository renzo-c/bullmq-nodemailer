import { NodeSDK } from '@opentelemetry/sdk-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { IORedisInstrumentation } from '@opentelemetry/instrumentation-ioredis';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';

const sdk = new NodeSDK({
  serviceName: 'producer',
  traceExporter: new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: 'http://localhost:4318/v1/metrics',
    }),
  }),
  instrumentations: [
    new ExpressInstrumentation(),
    new HttpInstrumentation(),
    new PgInstrumentation(),
    new IORedisInstrumentation()
  ],
});

sdk.start();
