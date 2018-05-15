# Guidelines for Contributing

js-xtract is part of a growing community of Music Information Retrieval tools available for the web. 
So first off, thank you for taking the time to contribute to this project.

## Submitting an Issue

As with all software projects, issues will appear and need addressing.
Due to the scope of this project, different issue types will occur.
This quick guide should give you an idea on how to report an issue correctly.

### 1. Where is the problem?

It may sound simple, but correctly identifying the type of problem is crucial.
Is it a problem in the code-base itself?
Is an algorithm incorrectly reporting errors?
Does it not work for a specific data type?
Is the behaviour unexpected (ie: it should have thrown an error but didn't)?

These questions will guide you to assigning one of the following labels to your issue report:
- Runtime: An error in a runtime environment. A function throws an error but should not have.
- Browser: An error occurs in a specific browser. Pick the browser tag for all browsers the issue appears in.
- Urgent: A mathematical error. The expected output of an extraction function is incorrect (and you can prove it).

### 2. Give the juicy details

Add as much information as possible to your report, but at a minimum please include the following:

a. The browser which has the issue, both name and version number. For instance Safari 11.1 or Firefox v56.
b. A description of the error being caused and why this is an error (if not obvious from the description).
c. Pseudo-code to reproduce the error to quickly diagnose

### 3. Triage

All new issues must be triaged first to determine their progress. No issue should be closed without being evaluated first.
Anyone can look at an issue an attempt to triage it, so please do contribute if you think you can help.

Once an issue has been triaged, the following tags will be applied:
- Cannot Reproduce: The triage result could not be reproduced in the same environment, caused possibly by no browser or code supplied. This may also be because of an outdated js-xtract was used or the error was fixed.
- Confirmed: Able to reproduce the error and confirm its existence
- No Issue: Able to reproduce the conditions but is not an error. An explanation must be given as to why
- Duplicate: The issue is already reported. The duplicate issue must be given
- Reject: The worst outcome. Sad faces. Usually from a bad issue report, but clear explanations must be given.

### 4. Development

When anyone attempts to work on an issue, the issue number must be used in the Git commit message to indicate the progress of the issue.
If an issue is attempted fixed, the original code must be run to confirm the fix. An explanation of why the issue occured should be reported.
The issue will be given the following tags:
- Resolved: Issue fixed and deployed
- Awaiting Response: Issue fixed but awaiting further confirmations
- Unresolved: Issue outstanding after fix applied.

### 5. Closure

We all want closure from these things. So once the fix has been applied, it will either close or remain open.
Closing the issue will occur when one of the following is met:
- Issue has the tag 'Resolved' and is in the master branch
- Issue is rejected and no counter given as to why it should be reconsidered.
- Issue it 'No Issue' and no-one elects a suitable reason as to why the original reason is incorrect

## Requesting Features

Generally, this is not a space to request a feature or an extractor directly.
It is not entirely fair to expect a developer to devote free-time to develop one new extractor.
So instead, give it a go yourself and submit a pull request with your new feature included.
However, to ensure no-one else is also working on the implementation, and to at least alert others to what you are doing, please open an issue stating as such.
Usually this done by explicitly stating you are working on feature 'x' with an outline of how it works, papers to refer to with the feature etc.

## Pull Requests

This work definitely supports and actively encourages you to submit a pull request.
But to ensure a seamless, turbulence free environment, please use the following check list.

### 1. Don't edit jsXtract.js directly

The `jsXtract.js` file is made by concatenating the files inside `/modules/` rather than editing itself. If you implement into jsXtract.js, your changes will not be preserved!

### 2. Edit the correct file in `/modules`

If you are building a low-level feature, it can be introduced into `/modules/jsXtract.js` for implementation. Then make sure you also extend the relevant modules ('TimeData' or 'SpectrumData' etc.).

### 3. Add a test!

Add a new test to the `/test/` folder (either vector, scalar or arrays depending on the feature return type) to preserve your feature.
That way, should anyone else harm your wonderfully crafted code, they'll get an error and have to fix their mistakes.

### 4. Detail your pull request

Include as much detail as would be required for others to use your code.
Give credit where due to the feature creator.
Ideally, write a short paragraph which can be put straight into the documentation.

