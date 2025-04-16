import dotenv from 'dotenv';

dotenv.config(); // Load .env file

export const config = {
    port: process.env.PORT || 5001,
    databaseUrl: process.env.DATABASE_URL,
    auth: {
        tenantId: process.env.AZURE_AD_TENANT_ID,
        clientId: process.env.AZURE_AD_CLIENT_ID, // Audience
        issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`,
        jwksUri: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/discovery/v2.0/keys`
    }
};

// Basic validation
if (!config.databaseUrl) {
    console.error("FATAL ERROR: DATABASE_URL is not defined.");
    process.exit(1);
}
if (!config.auth.tenantId || !config.auth.clientId) {
    console.error("FATAL ERROR: Azure AD configuration (Tenant ID, Client ID) is missing.");
    process.exit(1);
}