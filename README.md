This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## About
This is a frontend with auth for interacting with a Google Vertex AI Search Agent. 
The Milpub search agent is populated with the publically available PDFs on https://armypubs.army.mil. 

After creating an account, you can log in an interact with the agent. 

This is a template that can be applied to other collections and applications but one item unique to this one is I have the citation links point back to the URL of the source document. I pull this up via a metadata table in supabase after the Vertex agent supplies the citations. 

### Home page
<img width="917" alt="Screenshot 2024-10-31 at 7 50 24 AM" src="https://github.com/user-attachments/assets/d95ede7f-66ef-4cd6-924d-e9584b4b8183">

### Search Widget
<img width="904" alt="Screenshot 2024-10-31 at 7 51 33 AM" src="https://github.com/user-attachments/assets/a77595c8-2d66-451f-a5e8-3f9e5ef81edc">


## Env Vars
You need to set the following vars to run this

```bash
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-key>

# Google Cloud settings
GOOGLE_PROJECT_ID=<your-google-project>
GOOGLE_LOCATION=<your-google-location>
GOOGLE_COLLECTION_ID=<your-google-collection> # Probably default-collection
GOOGLE_ENGINE_ID=<your-google-agent-engine-id>

# Option 1: Path to service account key file
GOOGLE_APPLICATION_CREDENTIALS=<local-path-to-creds>

# Option 2: JSON credentials string (for production deployments)
# GOOGLE_CREDENTIALS={"type": "service_account", "project_id": "...", ...}
```

