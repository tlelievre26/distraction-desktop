# DistrAction: Fix Your Studying Habits

## Project Description

This is a desktop application that is designed to assist users in improving their study and work habits. The user starts a “study session” lasting a set duration of time, during which the application will track the desktop applications and Chrome websites that the user visits during the session. This data is compiled into an interactive timeline with a variety of focus-oriented metrics at the conclusion of the session, allowing the user to gain insight to the sources of their distraction while working. The user can see metrics for the entire study session, as well as for individual apps used during the session when the user selects on them. Using this data to observe any sort of patterns or habits that arise during a study session, promoting long term behavioral changes so they're overall more productive.

## Developers

This is a project developed by Stephanie Zhan, Taylor Le Lievre, and Wilson Wong for the Purdue Open Source Software Senior Design (ECE 49595O) course. 

# Getting Started

DistrAction can be installed via the installer linked on our Releases page. The installer was created electron-builder for Windows systems. Note that DistrAction will not work for other operating systems.

## Install InfluxDB

DistrAction requires a local installation of InfluxDB to store your app usage data. Please refer to the Influx's installation tutorial for Windows for instructions on setting up your local Influx instance. You do not need to install the Influx CLI for our app. We recommend extracting the files to your ProgramFiles directory.

Once Influx is installed, you will need to create a local account and set up an organization for our data buckets. Open a terminal in the directly where you installed Influx and run influxd to start the database service, which can be accessed over https://localhost:8086. IMPORTANT: When asked to create an organization, ensure it is named “Distraction” so our app can connect to it. You do not need to create a bucket; our app will automatically create the buckets needed. When given your API key, ensure you copy it for the next step.

Once you have your API key, launch our application and open the Settings menu on the homescreen. Input the API key along with the complete filepath to your Influx installation.

![image](https://github.com/user-attachments/assets/3d2cff99-43d9-44c3-974a-93fa1611b910)


Once you connect, you should get a popup informing you if the database launched and connected successfully, allowing you to begin a study session!

## DistrAction Chrome Extension

(We do not have the Chrome extension published to the store yet, but you can get it set up by downloading the source code and unpacking the chrome_api folder into your browser at chrome://extensions)

In order to track the user's website usage, we have a partner Chrome extension that is used to access data from the Chrome API. Once you have started a study session, you can connect the Chrome Extension by simply clicking on the icon, and pressing “Connect to WebSocket”. If there is an active study session on your desktop app, you will get a success notification and see websites on your timeline!


![image](https://github.com/user-attachments/assets/248e611d-ace3-4790-bbc4-2117092c7fb7)



## Help 

If you have an issue, please open a request on the “Issues” tab of the repository. Please note that as this is a Senior Design project, we currently do not have plans to maintain this project long-term. 

# User Manual

See our user manual [here](https://github.com/tlelievre26/distraction-desktop/blob/documentation/USERMANUAL.md)

# Licensing

This project uses the [MIT License](https://github.com/tlelievre26/distraction-desktop/blob/documentation/LICENSE.md)
