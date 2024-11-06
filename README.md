<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">

  <h3 align="center">Work From Home Management System (FlexiWork)</h3>

</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#built-with">Built With</a>
      <ul>
        <li><a href="#frontend">Frontend</a></li>
        <li><a href="#backend">Backend</a></li>
        <li><a href="#database">Database</a></li>
      </ul>
    </li>
    <li>
      <a href="#continuous-integration">Continuous Integration</a>
    </li>
    <li>
      <a href="#deployment">Deployment</a>
    </li>
    <li>
      <a href="#prerequisites">Prerequisites</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
  
  </ol>
</details>


Link to deployed app:
https://flexiwork.vercel.app/

Link to Git Repository:
https://github.com/seldomearly69/SPM-g1t8

## Built With

### Frontend

Found in the folder `/app`. Built with:

- [Next.js] - React Framework (https://nextjs.org/)
- [Tailwind CSS] - Styling (https://tailwindcss.com/)
- [Shadcn] - Component library(https://https://ui.shadcn.com/)
### Backend

Found in the folder `/backend`. Built with:

- [Flask] - Python Framework (https://flask.palletsprojects.com/en/stable/)
- [SQLAlchemy](https://www.sqlalchemy.org/)
- [GraphQl] - API (https://graphql.org/)
- [S3] - File Storage (https://aws.amazon.com/s3/)
- [RabbitMQ] - Message Queue (https://www.rabbitmq.com/)


## Continuous Integration
Continuous Integration is done through Github Actions. CI pipeline is set up to run on push to main branch. 

Link to CI pipeline scripts:
https://github.com/seldomearly69/SPM-g1t8/blob/main/.github/workflows/dockerimageci.yml

## Deployment

Frontend and backend are deployed separately. Frontend is deployed on Vercel, backend is deployed on AWS. Decision to deploy separately was made as frontend and backend could not deploy on AWS together due to EC2 free tier instance memory limit. 

## Prerequisites
- Docker
- Docker Compose 

## Getting started
1. Add environment variables to root directory
- Refer to .env file provided

2. Start app
- docker compose up --build

3. Verify the app is running
- http://localhost:3000

Authentication (The following accounts already have some mock data to get started)
1. Derek Tan (Sales Director)
user: Derek.Tan@allinone.com.sg
pass: password123

2. Rahim Khalid (Sales Manager)
user: Rahim.Khalid@allinone.com.sg
pass: password123

3. Jack Sim (MD)
user: jack.sim@allinon.com.sg
pass: password123

<p align="right">(<a href="#top">back to top</a>)</p>
