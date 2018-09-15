==== HOW TO BUILD ====

Prerequisites:

- Install node v8.11.0 or higher
- Install yarn v1.5.1 or higher

Then, move to the source code root and execute the following commands:

- yarn
- yarn run build
- rm -f firefox.zip && cd ./dist/firefox && zip -r ../../firefox.zip ./* 
&& cd -

The generated `firefox.zip` is the minified firefox extension uploaded 
to the dashboard.

