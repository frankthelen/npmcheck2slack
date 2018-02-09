# npmcheck2slack

Runs `npm-check` in the current working directory and posts the results to Slack.
Compares the installed package versions with their latest available versions.

[![build status](https://img.shields.io/travis/frankthelen/npmcheck2slack.svg)](http://travis-ci.org/frankthelen/npmcheck2slack)
[![Coverage Status](https://coveralls.io/repos/github/frankthelen/npmcheck2slack/badge.svg?branch=master)](https://coveralls.io/github/frankthelen/npmcheck2slack?branch=master)
[![Dependency Status](https://gemnasium.com/badges/github.com/frankthelen/npmcheck2slack.svg)](https://gemnasium.com/github.com/frankthelen/npmcheck2slack)
[![Greenkeeper badge](https://badges.greenkeeper.io/frankthelen/npmcheck2slack.svg)](https://greenkeeper.io/)
[![Maintainability](https://api.codeclimate.com/v1/badges/f71c0020a54eefa732ef/maintainability)](https://codeclimate.com/github/frankthelen/npmcheck2slack/maintainability)
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
    -u, --username <username>  username to be displayed in Slack, defaults to channel settings
    -e, --emoji <emoji>        emoji to be displayed in Slack, e.g., ":ghost:", defaults to channel settings
    -b, --branch <branch>      branch name to be displayed in Slack
    -r, --reluctant            do not send any message if all dependencies are up-to-date
    -h, --help                 output usage information
```
