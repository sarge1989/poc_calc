# Static calculator template
This project is created to build a reusable base template for static calculators. 

## Instructions
- Clone this project to start creating a new calculator product. 
  - Fonts are not included in this project. They can be downloaded from the DLS. 
- Do not merge product specific codes into this repository. 
- For exploration work on the template, please create a new branch. 

### Bundling
To bundle all js and less into 1 file: 
1. Run "npm install" to install the necessary packages. 
2. Go to index.js, then uncomment the less file import. (less file will be included in the bundle)
3. If the base js is not "index.js", go to webpack.config.js to change to the correct file name under "entry". 
4. Run "npm run build" to bundle the scripts. 
5. Go to the html file, then uncomment the script import that points to "./dist/index.bundle.js".
6. Comment the original js script and the less file. 

## File structure of a static calculator template.
The following is the file structure of a static calculator template.

### index.html

This is the main html template that can be reused to create other form pages.

### Assets -- assets of each component (svgs)

This folder contains assets used by each component. These assets are classified under their respective component folders.

Note that the Header folder can be removed as actual production page will have header and footer in the template.

### components

This folder consists of the base code of components. Use [data-include-?] in the main HTML page to set component id, add class name and modify elements. <div data-include="standard_button"> rendering is only applicable to components with short content. Components included so far are: 
- Buttons and links
  - Standard button
  - Text link
  - Dropdown button
- Form elements
  - Basic dropdown selector
  - Numerical input
  - Radio button
  - Single checkbox
  - Single date picker
- Section header
- Separators
  - Horizontal separators
  - Vertical separators

Other components should be added directly to the main HTML page.

Note that the Header and footer folder can be removed as actual production page will have header and footer in the template.


### js -- all javascript files
This folder consists of the base and component javascript files. 

- base -- This folder consists of all the base js that needs to be included
- components -- This folder consists of all the js specific to each component that requires js rendering. 
- global-navigation -- This folder can be removed as actual production page will have header and footer in the template.
- references -- This folder consists of js used only for the reference pages.
- index.js -- Main js used by index.html

### less
This folder consists of the base and component less files.
- base -- These are the base styling that must be included in the html file
- components -- This folder consists of all the less files specific to each component. 
- global-navigation -- This folder can be removed as actual production page will have header and footer in the template.
- calculator_template.less -- This is the main less file included in the html. It also includes form_base.less. 
- form_base.less -- All the commonly used components for forms are included here
- media.less -- Media query constants
- references.less -- This less file is used for reference pages only. 
  
### public -- Fonts and Icons
- Fonts are not included in this project. They can be downloaded from the DLS. 
- New icons can also be downloaded from the DLS. Note that adding new icons also means that the icon less file is also updated. 

### reference
This folder consists of the guide to using each component. For components that are not included in the template, please refer to DLS. 

### Additional notes
- All inline styles are added for demo purposes and are not part of the component.
