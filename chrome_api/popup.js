

// const tabData = () =>{
//   document.addEventListener('DOMContentLoaded', () => {

//     chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    

//       const currentTab = tabs[0];

//       const title = currentTab.title;
//       const url = currentTab.url;
//       const id = currentTab.id;

    
//       document.getElementById('tab-info').innerHTML = `
//             <p><strong>Title:</strong> ${title}</p>
//             <p><strong>URL:</strong> ${url}</p>
//             <p><strong>ID:</strong> ${id}</p>
//         `;
//     });
//   });


// };


// tabData();

const getCurrentTab = async (_activeInfo) => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};


chrome.tabs.onActived.addListener(
  getCurrentTab
);


