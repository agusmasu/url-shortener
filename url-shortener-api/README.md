<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## URL Shortener API Features

This is a URL shortener API built with NestJS that allows you to create shortened URLs and redirect users to the original URLs.

### API Endpoints

#### Create a shortened URL
```bash
POST /url
Content-Type: application/json

{
  "url": "https://www.example.com/very-long-url"
}
```

Response:
```json
{
  "id": 1,
  "url": "https://www.example.com/very-long-url",
  "slug": "abc123",
  "createdBy": "user_1234",
  "createdAt": "2025-07-15T00:58:24.291Z",
  "updatedAt": "2025-07-15T00:58:24.291Z"
}
```

#### Redirect to original URL
```bash
GET /{slug}
```

This will redirect the user to the original URL associated with the slug. For example:
- `GET /abc123` → redirects to `https://www.example.com/very-long-url`

#### Alternative redirect endpoint
```bash
GET /url/redirect/{slug}
```

Same functionality as the root-level redirect, but with explicit `/url/redirect/` prefix.

#### Get all URLs
```bash
GET /url
```

#### Get URL by ID
```bash
GET /url/{id}
```

#### Update URL
```bash
PATCH /url/{id}
Content-Type: application/json

{
  "url": "https://www.new-example.com"
}
```

#### Delete URL
```bash
DELETE /url/{id}
```

#### Get visit statistics for a URL
```bash
GET /url/{id}/stats
```

Response:
```json
{
  "totalVisits": 150,
  "recentVisits": 25,
  "uniqueVisitors": 18
}
```

#### Get visit history for a URL
```bash
GET /url/{id}/visits?limit=20&offset=0
```

Response:
```json
[
  {
    "id": 1,
    "urlId": 1,
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "referer": "https://google.com",
    "visitedAt": "2025-07-15T10:30:00.000Z"
  }
]
```

#### Get all visits across all URLs
```bash
GET /url/visits/all?limit=50&offset=0
```

### Visit Tracking Features

The API automatically tracks visits to shortened URLs with the following information:
- **IP Address**: Visitor's IP address for analytics
- **User Agent**: Browser/client information
- **Referer**: The page that linked to the shortened URL
- **Timestamp**: When the visit occurred
- **Visit Count**: Total number of visits per URL

Visit tracking happens automatically when someone visits a shortened URL. The tracking is non-blocking, so it doesn't slow down the redirect process.

### How it works

1. When you create a shortened URL, the API generates a unique 6-character slug
2. The slug is used to create a shortened URL like `http://localhost:3000/abc123`
3. When someone visits the shortened URL, they are automatically redirected to the original URL
4. If a slug doesn't exist, a 404 error is returned

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
