# How To Use DistrAction

## Start Screen
![image](https://github.com/user-attachments/assets/8c611f46-cfdd-43b1-9155-66c2ee4192cf)

### Task List
This is where the user is able to create a task list for the upcoming study session. All tasks created here will carry over to the study session, and you can set a current task for the beginning of the session Whenever a task is marked as "current task", it will be represented on the timeline from the time it was marked as current to the time it was completed, deleted, or another task was set as the current task.

### Previous Sessions

This button allows you to revisit old study sessions, and loads in the associated data to the timeline. Old study sessions will be automatically added to this menu (although this tends to have a delay).

### Settings

This is where you can input the file path and API key used for connecting to InfluxDB. If both fields have values, the app will automatically try to launch and connect to Influx on startup. Otherwise, it will wait for the user to connect manually. Please not that the app **will not let you start a session** until a successful connection with InfluxDB has been established.

## Session Screen

![image](https://github.com/user-attachments/assets/e8268fcf-f8fb-4171-999d-64e2b5f67fb2)

### End Study Session

Study sessions can be manually ended early before the timer runs out using the button in the top-right of the screen.

### Chrome Extension Warning

For information about installing our Chrome extension, please refer to our README. Once you have the extension installed, you can connect it to begin streaming browser data by pressing the "Connect to WebSocket" button **while a study session is active**. When a successful connection is made, the warning will dissapear.

## Timeline Screen

![image](https://github.com/user-attachments/assets/256b6392-0837-4ee6-b607-0980d3eb5bba)


![image](https://github.com/user-attachments/assets/2f1935db-d4ae-4ee7-8792-b68511c6b83a)


![image](https://github.com/user-attachments/assets/a7eb97dd-c7be-4397-a1e9-79c4f8a7df0d)


### Chunk Size

You can have the study session broken into different sized chunks ranging from 15 minutes up to 2 hours, using the menu in the top-left corner. Larger chunks will only show the apps you used for longer amounts of time while filtering out apps you used more briefly, while smaller chunks will let you see much smaller "slices" of time when zooming in.

### App Timeline

By clicking on a specific chunk, you will see a view of all apps used during that period of time. By default, apps only used for a short duration (relative to the chunk size) are filtered out for the sake of visual clarity. The zoom buttons in the top-right of the screen allow you see the app usage in more granular detail.

Apps are color coded and can be selected by clicking on their specific chunk.Doing so will highlight all uses of that app within the chunk, along with overall metrics related to your use of the app across the entire study session.
