# Instaplanned App

## About

Instaplanned is a service marketplace that let customers purchase wedding service packages from
service providers (for e.g. Photographer, Videographer, Venue, Caterers, DJs etc).

Customers will be able to purchase either standard packages offered by the provider (for e.g. Basic,
Standard, Premium) or get a Custom Offer for their needs.

Both virtual on-demand, as well as time-specific and location-bound service packages will be
available - similar to how Fiverr and AirBnB operates.

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

<code>

git clone https://github.com/syed-instaplanned/ftw-instaplanned.git

npm run dev

</code>
