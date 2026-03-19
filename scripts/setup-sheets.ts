import { google } from 'googleapis'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

async function setup() {
  const sheets = google.sheets({ version: 'v4', auth })
  const id = process.env.GOOGLE_SHEETS_ID!

  console.log('Setting up Google Sheets...')

  // Queue sheet headers (columns A through AC)
  await sheets.spreadsheets.values.update({
    spreadsheetId: id, range: 'Queue!A1:AC1',
    valueInputOption: 'RAW',
    requestBody: { values: [[
      'id','case_name','language','channel_slot','content_type','priority','notes',
      'source','status','retry_count','failed_step','error_message','script',
      'voice_url','image_urls','video_url','yt_title','yt_description','yt_tags',
      'yt_video_id','yt_url','scheduled_publish_at','published_at',
      'approval_requested_at','approved_at','rejection_reason','rejection_count',
      'created_at','updated_at'
    ]] }
  })

  // Logs sheet headers
  await sheets.spreadsheets.values.update({
    spreadsheetId: id, range: 'Logs!A1:G1',
    valueInputOption: 'RAW',
    requestBody: { values: [['id','content_id','step','status','message','duration_ms','created_at']] }
  })

  // Config sheet
  await sheets.spreadsheets.values.update({
    spreadsheetId: id, range: 'Config!A1:B2',
    valueInputOption: 'RAW',
    requestBody: { values: [['pipeline_paused','false'],['daily_limit','3']] }
  })

  // Pre-load first 5 demo cases
  const cases = [
    ['JOB_001','Auto Shankar — The Chennai Serial Killer','english','1','india','5','','manual','queued','0','','','','','','','','','','','','2024-01-02T12:30:00Z','','','','','0',new Date().toISOString(),new Date().toISOString()],
    ['JOB_002','Jack the Ripper — Unmasked','english','1','international','5','','manual','queued','0','','','','','','','','','','','','2024-01-05T12:30:00Z','','','','','0',new Date().toISOString(),new Date().toISOString()],
    ['JOB_003','Auto Shankar — முழு கதை','tamil','2','india','5','','manual','queued','0','','','','','','','','','','','','2024-01-07T12:30:00Z','','','','','0',new Date().toISOString(),new Date().toISOString()],
    ['JOB_004','The Nithari Killings','english','1','india','5','','manual','queued','0','','','','','','','','','','','','2024-01-09T12:30:00Z','','','','','0',new Date().toISOString(),new Date().toISOString()],
    ['JOB_005','Veerappan — The Forest Bandit','tamil','2','india','5','','manual','queued','0','','','','','','','','','','','','2024-01-14T12:30:00Z','','','','','0',new Date().toISOString(),new Date().toISOString()],
  ]
  await sheets.spreadsheets.values.append({
    spreadsheetId: id, range: 'Queue!A2',
    valueInputOption: 'RAW',
    requestBody: { values: cases }
  })

  console.log('✅ Google Sheets setup complete')
  console.log('✅ Created sheets: Queue, Logs, Config')
  console.log('✅ Added 5 demo cases to Queue')
  console.log('\nNext steps:')
  console.log('1. Open your Google Sheet and verify the 3 tabs exist')
  console.log('2. Fill in the remaining environment variables')
  console.log('3. Start the development server: npm run dev')
}

setup().catch((error) => {
  console.error('❌ Setup failed:', error.message)
  process.exit(1)
})
