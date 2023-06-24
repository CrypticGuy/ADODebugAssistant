// Saves options to chrome.storage
// const saveOptions = () => {
//     const color = document.getElementById('color').value;
//     const likesColor = document.getElementById('like').checked;
  
//     chrome.storage.sync.set(
//       { favoriteColor: color, likesColor: likesColor },
//       () => {
//         // Update status to let user know options were saved.
//         const status = document.getElementById('status');
//         status.textContent = 'Options saved.';
//         setTimeout(() => {
//           status.textContent = '';
//         }, 750);
//       }
//     );
// };

const config = [
  {
    "input": "bookmarkedAdoAccount",
    "output": "reviewAdoAccount"
  },
  {
    "input": "bookmarkedProdTaskGuids",
    "output": "reviewProdTaskGuids"
  },
  {
    "input": "bookmarkedTestTaskGuids",
    "output": "reviewTestTaskGuids"
  }
]

const setSuccessStatusMessage = (name) => {
  const status = document.getElementById('status');
  status.textContent = `Status: ${name} input saved`;
  setTimeout(() => {
    status.textContent = '';
  }, 4000);
}

const createViewPills = (input, output) => {
  const commaSeparatedValues = localStorage.getItem(input)
  let listValues = commaSeparatedValues.split(',')
  let finalHtml = ""
  listValues.forEach(elm => {
    finalHtml += `<span class="pill">${elm}</span>`
  })
  document.getElementById(output).innerHTML = finalHtml
}

config.forEach(elm => {
  let target = document.getElementById(elm.input)
  createViewPills(elm.input, elm.output)
  const currVal = localStorage.getItem(elm.input)
  target.value = currVal
  target.addEventListener("focusout", function() {
    let storageObject = {}
    storageObject[elm.input] = target.value
    console.log(storageObject)
    try {
      localStorage.setItem(elm.input, target.value)
      setSuccessStatusMessage(elm.input)
      createViewPills(elm.input, elm.output)
    } catch {
      alert("Exception occured while saving")
    }
  })
})
