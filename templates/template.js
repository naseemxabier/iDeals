
function templateExample ({name, dealTitle, dealDescription, dealLocation, img}) { 
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email</title>
    </head>
    <body>
    <body class="bg-light">
    <div class="container">
      <img class="ax-center my-10 w-24" src="https://www.intelligentdeals.com/images/logo-b.png" />
      <div class="card p-6 p-lg-10 space-y-4">
        <h1 class="h3 fw-700">
          Hello ${name}! 
        </h1>
        <p>
          Someone added a deal called ${dealTitle} in which you may be interested!

          <img src="${img}"/>
          <p>${dealDescription}</p>

          You will find it in ${dealLocation}!

          Visit our website for further information!<br>
        </p>
        <a class="btn btn-primary p-3 fw-700" href="http://localhost:3000/">Visit our Website</a>
      </div>
      <img class="ax-center mt-10 w-40" src="https://www.intelligentdeals.com/images/logo-b.png" />
      <div class="text-muted text-center my-6">
        Sent with <3 from iDeals Team <br>
        iDeals Spain<br>
        C/Pamplona 96, Barcelona, Spain<br>
      </div>
    </div>
  </body>
    </body>
    </html>
`;
  }
  
module.exports = {
    templateExample,
  }
  