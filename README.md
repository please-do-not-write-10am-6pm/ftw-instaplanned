# Instaplanned App

## About

Instaplanned is a service marketplace that let customers purchase wedding service packages from
service providers (for e.g. Photographer, Videographer, Venue, Caterers, DJs etc).

Customers will be able to purchase either standard packages offered by the provider (for e.g. Basic,
Standard, Premium) or get a Custom Offer for their needs.

Both virtual on-demand, as well as time-specific and location-bound service packages will be
available

## Stacks

- JavaScript: the programming language for the whole application
- CSS: styling the user interface using CSS Modules
- React: library for creating user interfaces with components
- Redux: state and data flow handling
- React Router: routing
- Final Form: forms
- Express: server side rendering of the React application
- Node.js: development tooling and running the Express server

## Functionality

### Personal Service and Venue Booking

This will be primary type of listing and is Location Specific, Scheduling-based, and with Packaged
Pricing. In this flow customer is able to book venues, photography, videography, catering, DJ
services etc - that are performed at a specific location, at a specific time. Location and provider
availability are critical components in this flow.

### On Demand / Virtual Services

These services do not require scheduling since customer and provider do not have to meet - and are
performed virtually and delivered digitally. This could include graphic designing, photo / video
editing, stationary design etc.

### User Journey

There are three distinct user journeys in the platform:

- Search: Search happens when customers search for listings on the marketplace using some
  combination of keywords, availability, filters, and sorting.

- Listing creation: Listings are created by providers to promote a product or service they are
  offering. What information providers enter into a listing, such a price or category, is usually
  the basis for the customer’s search experience.

- Transactions: The transaction process determines how a customer and providers interact on the
  marketplace.

## How to run

```
git clone git@github.com:sharetribe/ftw-hourly.git             # clone this repository
cd ftw-instaplanned/                                           # change to the cloned directory
yarn install                                                   # install dependencies
yarn run config                                                # add the mandatory env vars to your local config.
yarn run dev                                                   # start the dev server, this will open a browser in localhost:3000
```
### For Windows users

Change `export` to `set` in the package.json file if you're using Windows/DOS. You need to do the
change to "dev" and "dev-sever" commands.

```
"dev": "yarn run config-check&&set NODE_ENV=development&& set REACT_APP_DEV_API_SERVER_PORT=3500&&concurrently --kill-others \"yarn run dev-frontend\" \"yarn run dev-backend\""
```

```
"dev-server": "set NODE_ENV=development&& set PORT=4000&& set REACT_APP_CANONICAL_ROOT_URL=http://localhost:4000&&yarn run build&&nodemon --watch server server/index.js"
```

We strongly recommend installing
[Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/about), if you are
developing on Windows. These templates are made for Unix-like web services which is the most common
environment type on host-services for web apps. Also, Flex Docs uses Unix-like commands in articles
instead of DOS commands.
