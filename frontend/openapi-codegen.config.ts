import { defineConfig } from '@openapi-codegen/cli';
import { 
  generateSchemaTypes, 
  generateReactQueryComponents
} from '@openapi-codegen/typescript';

export default defineConfig({
  bookingApi: {
    from: {
      source: 'url',
      url: 'http://localhost:8080/openapi/v1.json', // Your API's OpenAPI spec endpoint
    },
    outputDir: 'src/api',
    to: async (context) => {
      // Override server URLs in the OpenAPI document
      context.openAPIDocument.servers = [
        { url: 'http://localhost:8080' }
      ];
      
      const filenamePrefix = 'BookingApi';
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
});