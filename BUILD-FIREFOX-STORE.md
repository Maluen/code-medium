==== HOW TO BUILD ====

Prerequisites:

- Install node v12.4.0 or higher
- Install yarn v1.21.1 or higher

Then, move to the source code root and execute the following commands:

- yarn
- yarn run build
- rm -f firefox.zip && cd ./dist/firefox && zip -r ../../firefox.zip ./* 
&& cd -

In case of C++ build errors when running `yarn`, run the following command and retry:
- npm install --unsafe-perm node-sass

The generated `firefox.zip` is the minified firefox extension uploaded 
to the dashboard.

