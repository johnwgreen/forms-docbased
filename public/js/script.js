async function fetchContent() {
  const path = window.location.pathname;
  const container = document.getElementById('form-block');
  const anchor = document.createElement('a');
  let pathType = '';
  let actualPath = '';
  if (path.startsWith('/doc')) {
    actualPath = path.substring(4);
    anchor.setAttribute('href', `/eds${actualPath}.json`);
    pathType = 'Doc-based';
  } else {
    pathType = 'AEM';
    actualPath = path;
    if (path.startsWith('/aem')) {
      actualPath = path.substring(4);
    }
    anchor.setAttribute('href', `/content/forms/af/${actualPath}/jcr:content/guideContainer.model.json`);
  }
  container.appendChild(anchor);
  try {
    if (actualPath.length > 1) {
    // hide the instructions div
      const instructions = document.getElementById('instructions');
      if (instructions) {
        instructions.style.display = 'none';
      }
      // set text content of status div to pathType
      const status = document.getElementById('status');
      status.style.display = 'block';
      if (status) {
        status.innerHTML = `Loading the Form from ${pathType} <code>${actualPath}</code> ...`;
      }
      const block = await import('../../blocks/form/form.js');
      await block.default(container);
      if (status) {
        status.innerHTML = `Loaded the Form from ${pathType} <code>${actualPath}</code>`;
      }
    }
  } catch (e) {
    console.error(e);
    const error = document.createElement('p');
    error.textContent = 'Error loading form. Please check the URL';
    container.appendChild(error);
    // show the instructions div
    const instructions = document.getElementById('instructions');
    if (instructions) {
      instructions.style.display = 'block';
    }
    // set text content of status div to empty
    const status = document.getElementById('status');
    if (status) {
      status.textContent = '';
      status.style.display = 'none';
    }
  }
}

window.onload = fetchContent;
