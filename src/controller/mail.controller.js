import { sendMail } from "../util/mail.js";

export const sendRegistrationMail= async (name, email, userId, password) => {
    const subject = "Registration Successful - Careers @ Whiteboard Technologies Pvt. Ltd";
    const text = `Dear ${name},\n\nYour registration was successful. Your user ID is ${userId} and password is ${password}.`;
    const html = `<html lang='en'>
  <head>
    <meta charset='UTF-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    <link rel='stylesheet' href='../src/output.css' />
    <link rel='stylesheet' href='./style.css' />
    <script src='https://cdn.tailwindcss.com'></script>
    <link
      href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css'
      rel='stylesheet'
      integrity='sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH'
      crossorigin='anonymous'
    />
    <script
      src='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
      integrity='sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz'
      crossorigin='anonymous'
    ></script>
  </head>
  <body class="bg-light">
    <div class='container bg-white shadow-sm rounded p-4 mt-5'>
      <div class='text-center mb-4'>
        <img src='https://firebasestorage.googleapis.com/v0/b/whiteboard-website.appspot.com/o/assets%2Fimage%2Flogo%2Fwhiteboardtec-logo.png?alt=media&token=f73c5257-9b47-4139-84d9-08a1b058d7e9' alt='Company Logo' class='img-fluid' />
      </div>
      <div class="text-center text-white mb-4">
        <span class='fs-1 mx-auto bg-success rounded-pill  px-5 py-1'>Registration Successful</span>
      </div>
      <div class="px-5">
        <h2 class='fs-4 mt-4'> Welcome to Whiteboard Technologies! You're registered in our Career Portal</h2>
        <p class='mt-4'>Dear <b>${name}</b>,</p>
        <p>Welcome to Whiteboard Technologies Pvt. Ltd.</p>
        <p>You can now log in to our Career Portal at [<a href="http://106.51.141.125:808/">Whiteboard Carrer Quizcave</a>] using the credentials provided below:</p>
          <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">User's Details</h5>
        <ul class="list-group list-group-flush">
          <li class="list-group-item"><strong>Name:</strong> ${name}</li>
          <li class="list-group-item"><strong>User Id:</strong> ${userId}</li>
          <li class="list-group-item"><strong>Registered Email:</strong> ${email}</li>
          <li class="list-group-item"><strong>Password:</strong>${password}
</li>
        </ul>
      </div>
    </div>
        <p>Thank you & Regards,</p>
        <span><b>Whiteboard Technologies Pvt. Ltd.</b></span>
        <br>
        <span>Bangalore</span>
      </div>
    </div>
  </body>
</html>`;

    await sendMail(email, subject, text, html);
}

export const sendDeclaredResult = async (email, name, date) => {
    const subject = "Result Declared - Careers @ Whiteboard Technologies Pvt. Ltd";
    const text = `Dear ${name},\n\nYour result has been declared.`;
    const html = `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="../src/output.css" />
    <link rel="stylesheet" href="./style.css" />
    <script src="https://cdn.tailwindcss.com"></script>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
      crossorigin="anonymous"
    />
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
      crossorigin="anonymous"
    ></script>
  </head>
  <body class="bg-light">
    <div class="container bg-white shadow-sm rounded p-4 mt-5">
      <div class="text-center mb-4">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/whiteboard-website.appspot.com/o/assets%2Fimage%2Flogo%2Fwhiteboardtec-logo.png?alt=media&token=f73c5257-9b47-4139-84d9-08a1b058d7e9"
          alt="Company Logo" class="img-fluid"
        />
      </div>
      <div class="text-center text-white mb-4">
        <span class="fs-1 mx-auto bg-success rounded-pill px-5 py-1">Result Declared</span>
      </div>
      <div class="px-5">
        
        <h1 class="text-lg font-bold text-gray-800 w-full text-end" id="date"></h1>
        <h2 class="fs-4 mt-4">Congratulations! Your results are out.</h2>
        <p class="mt-4">Dear <b>${name}</b>,</p>
        <br/>
        <p>We are pleased to inform you that your result for <strong>Fresher's Selection Test</strong> which was conducted on <strong>${date.toLocaleDateString()}</strong> have been declared. </p>
        <p>Congratulations! On been selected for the next round of hiring process.</p>
        
        <br/>
        <p>Our hiring team, will soon contact you for further discussion</p>
        <br/>
        <p>Thank you & Regards,</p>
        <span><b>Whiteboard Technologies Pvt. Ltd.</b></span>
        <br />
        <span>Bangalore</span>
      </div>
    </div>
    <script>
      document.getElementById('date').textContent = new Date().toLocaleDateString();
    </script>
  </body>
</html>`;
	
	console.log(text, email);
    await sendMail(email, subject, text, html);
}
