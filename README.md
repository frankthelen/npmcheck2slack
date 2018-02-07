# npmcheck2slack

Runs `npm-check` in the current working directory and posts the results to Slack.

[![build status](https://img.shields.io/travis/frankthelen/npmcheck2slack.svg)](http://travis-ci.org/frankthelen/npmcheck2slack)
[![Coverage Status](https://coveralls.io/repos/github/frankthelen/npmcheck2slack/badge.svg?branch=master)](https://coveralls.io/github/frankthelen/npmcheck2slack?branch=master)
[![Dependency Status](https://gemnasium.com/badges/github.com/frankthelen/npmcheck2slack.svg)](https://gemnasium.com/github.com/frankthelen/npmcheck2slack)
[![Greenkeeper badge](https://badges.greenkeeper.io/frankthelen/npmcheck2slack.svg)](https://greenkeeper.io/)
[![Maintainability](https://api.codeclimate.com/v1/badges/f71c0020a54eefa732ef/maintainability)](https://codeclimate.com/github/frankthelen/npmcheck2slack/maintainability)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Ffrankthelen%2Fnpmcheck2slack.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Ffrankthelen%2Fnpmcheck2slack?ref=badge_shield)
[![node](https://img.shields.io/node/v/npmcheck2slack.svg)]()
[![code style](https://img.shields.io/badge/code_style-airbnb-brightgreen.svg)](https://github.com/airbnb/javascript)
[![License Status](http://img.shields.io/npm/l/npmcheck2slack.svg)]()

## Install

```bash
npm install -g npmcheck2slack
```

## Usage

```bash
npmcheck2slack --help

  Usage: npmcheck2slack [options] <webhookuri>

  Options:
    -v, --version              output the version number
    -u, --username [username]  The username to be displayed in Slack. Defaults to your channel settings.
    -e, --emoji [emoji]        The emoji to be displayed in Slack, e.g., ":ghost:". Defaults to your channel settings.
    -h, --help                 output usage information
```
