export default function NotFound() {
  return (
    <html>
      <head>
        <title>Redirecting...</title>
        <script
          dangerouslySetInnerHTML={{
            __html: 'window.location.replace("/?welcome=true");'
          }}
        />
      </head>
      <body>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <p className="text-slate-500 font-medium">Redirigiendo al inicio...</p>
        </div>
      </body>
    </html>
  );
}
