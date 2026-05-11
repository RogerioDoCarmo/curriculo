import{n as e}from"./chunk-BEldbCjX.js";import{p as t}from"./iframe-CIkfW9l8.js";import{n,t as r}from"./ThemeToggle-DYAFMbUh.js";var i,a,o,s,c,l,u,d;e((()=>{i=t(),n(),a={title:`Components/ThemeToggle`,component:r,parameters:{layout:`centered`,docs:{description:{component:`ThemeToggle component — button to switch between light and dark modes.

Features:
- Sun icon (☀️) in dark mode (clicking switches to light)
- Moon icon (🌙) in light mode (clicking switches to dark)
- Smooth transition animations
- Keyboard accessible with focus indicators
- Persists theme preference to localStorage
- Detects system preference on first load

Requirements: 17.5, 17.6, 17.8`}}},tags:[`autodocs`],argTypes:{className:{control:`text`,description:`Additional CSS classes to apply to the button`}}},o={args:{}},s={args:{className:`shadow-lg`}},c={render:()=>(0,i.jsxs)(`div`,{className:`flex gap-4 items-center`,children:[(0,i.jsxs)(`div`,{className:`flex flex-col items-center gap-2`,children:[(0,i.jsx)(r,{}),(0,i.jsx)(`span`,{className:`text-xs text-gray-600 dark:text-gray-400`,children:`Default`})]}),(0,i.jsxs)(`div`,{className:`flex flex-col items-center gap-2`,children:[(0,i.jsx)(r,{className:`shadow-md`}),(0,i.jsx)(`span`,{className:`text-xs text-gray-600 dark:text-gray-400`,children:`With Shadow`})]}),(0,i.jsxs)(`div`,{className:`flex flex-col items-center gap-2`,children:[(0,i.jsx)(r,{className:`scale-125`}),(0,i.jsx)(`span`,{className:`text-xs text-gray-600 dark:text-gray-400`,children:`Larger`})]})]})},l={render:()=>(0,i.jsxs)(`nav`,{className:`flex items-center justify-between p-4 bg-background border-b border-border`,children:[(0,i.jsx)(`div`,{className:`text-lg font-bold`,children:`My Website`}),(0,i.jsxs)(`div`,{className:`flex items-center gap-4`,children:[(0,i.jsx)(`a`,{href:`#`,className:`text-sm hover:underline`,children:`Home`}),(0,i.jsx)(`a`,{href:`#`,className:`text-sm hover:underline`,children:`About`}),(0,i.jsx)(`a`,{href:`#`,className:`text-sm hover:underline`,children:`Contact`}),(0,i.jsx)(r,{})]})]})},u={render:()=>(0,i.jsxs)(`div`,{className:`flex flex-col items-center gap-4 p-6 max-w-md`,children:[(0,i.jsx)(`h3`,{className:`text-lg font-semibold`,children:`Theme Preferences`}),(0,i.jsx)(`p`,{className:`text-sm text-gray-600 dark:text-gray-400 text-center`,children:`Toggle between light and dark mode. Your preference will be saved for future visits.`}),(0,i.jsx)(r,{}),(0,i.jsx)(`p`,{className:`text-xs text-gray-500 dark:text-gray-500 text-center`,children:`Click the button to switch themes`})]})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...o.parameters?.docs?.source},description:{story:`Default theme toggle button`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    className: "shadow-lg"
  }
}`,...s.parameters?.docs?.source},description:{story:`Theme toggle with custom styling`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-4 items-center">
      <div className="flex flex-col items-center gap-2">
        <ThemeToggle />
        <span className="text-xs text-gray-600 dark:text-gray-400">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ThemeToggle className="shadow-md" />
        <span className="text-xs text-gray-600 dark:text-gray-400">With Shadow</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ThemeToggle className="scale-125" />
        <span className="text-xs text-gray-600 dark:text-gray-400">Larger</span>
      </div>
    </div>
}`,...c.parameters?.docs?.source},description:{story:`Multiple theme toggles demonstrating different states`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <nav className="flex items-center justify-between p-4 bg-background border-b border-border">
      <div className="text-lg font-bold">My Website</div>
      <div className="flex items-center gap-4">
        <a href="#" className="text-sm hover:underline">
          Home
        </a>
        <a href="#" className="text-sm hover:underline">
          About
        </a>
        <a href="#" className="text-sm hover:underline">
          Contact
        </a>
        <ThemeToggle />
      </div>
    </nav>
}`,...l.parameters?.docs?.source},description:{story:`Theme toggle in a navigation bar context`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col items-center gap-4 p-6 max-w-md">
      <h3 className="text-lg font-semibold">Theme Preferences</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Toggle between light and dark mode. Your preference will be saved for future visits.
      </p>
      <ThemeToggle />
      <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
        Click the button to switch themes
      </p>
    </div>
}`,...u.parameters?.docs?.source},description:{story:`Theme toggle with explanatory text`,...u.parameters?.docs?.description}}},d=[`Default`,`WithCustomClass`,`MultipleToggles`,`InNavbar`,`WithExplanation`]}))();export{o as Default,l as InNavbar,c as MultipleToggles,s as WithCustomClass,u as WithExplanation,d as __namedExportsOrder,a as default};