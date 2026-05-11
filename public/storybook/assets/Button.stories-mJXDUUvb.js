import{n as e}from"./chunk-Bj-mKKzh.js";import{t}from"./jsx-runtime-D2H7xMg0.js";import{n,t as r}from"./Button-UFadr9XZ.js";var i,a,o,s,c,l,u,d,f,p,m,h,g;e((()=>{i=t(),n(),a={title:`Components/Button`,component:r,parameters:{layout:`centered`,docs:{description:{component:`Button component with multiple variants and sizes.

Supports three visual styles (primary, secondary, ghost) and three sizes (sm, md, lg).
Includes loading and disabled states with proper accessibility attributes.`}}},tags:[`autodocs`],argTypes:{variant:{control:`select`,options:[`primary`,`secondary`,`ghost`],description:`Visual style of the button`},size:{control:`select`,options:[`sm`,`md`,`lg`],description:`Size of the button`},disabled:{control:`boolean`,description:`Whether the button is disabled`},loading:{control:`boolean`,description:`Whether the button shows a loading spinner`},onClick:{action:`clicked`,description:`Click handler function`}}},o={args:{variant:`primary`,size:`md`,children:`Primary Button`}},s={args:{variant:`secondary`,size:`md`,children:`Secondary Button`}},c={args:{variant:`ghost`,size:`md`,children:`Ghost Button`}},l={args:{variant:`primary`,size:`sm`,children:`Small Button`}},u={args:{variant:`primary`,size:`md`,children:`Medium Button`}},d={args:{variant:`primary`,size:`lg`,children:`Large Button`}},f={args:{variant:`primary`,size:`md`,children:`Disabled Button`,disabled:!0}},p={args:{variant:`primary`,size:`md`,children:`Loading Button`,loading:!0}},m={render:()=>(0,i.jsxs)(`div`,{className:`flex gap-4`,children:[(0,i.jsx)(r,{variant:`primary`,size:`md`,children:`Primary`}),(0,i.jsx)(r,{variant:`secondary`,size:`md`,children:`Secondary`}),(0,i.jsx)(r,{variant:`ghost`,size:`md`,children:`Ghost`})]})},h={render:()=>(0,i.jsxs)(`div`,{className:`flex items-center gap-4`,children:[(0,i.jsx)(r,{variant:`primary`,size:`sm`,children:`Small`}),(0,i.jsx)(r,{variant:`primary`,size:`md`,children:`Medium`}),(0,i.jsx)(r,{variant:`primary`,size:`lg`,children:`Large`})]})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "primary",
    size: "md",
    children: "Primary Button"
  }
}`,...o.parameters?.docs?.source},description:{story:`Primary button - main call-to-action`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "secondary",
    size: "md",
    children: "Secondary Button"
  }
}`,...s.parameters?.docs?.source},description:{story:`Secondary button - alternative action`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "ghost",
    size: "md",
    children: "Ghost Button"
  }
}`,...c.parameters?.docs?.source},description:{story:`Ghost button - subtle action`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "primary",
    size: "sm",
    children: "Small Button"
  }
}`,...l.parameters?.docs?.source},description:{story:`Small size button`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "primary",
    size: "md",
    children: "Medium Button"
  }
}`,...u.parameters?.docs?.source},description:{story:`Medium size button (default)`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "primary",
    size: "lg",
    children: "Large Button"
  }
}`,...d.parameters?.docs?.source},description:{story:`Large size button`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "primary",
    size: "md",
    children: "Disabled Button",
    disabled: true
  }
}`,...f.parameters?.docs?.source},description:{story:`Disabled button - cannot be clicked`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "primary",
    size: "md",
    children: "Loading Button",
    loading: true
  }
}`,...p.parameters?.docs?.source},description:{story:`Loading button - shows spinner`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-4">
      <Button variant="primary" size="md">
        Primary
      </Button>
      <Button variant="secondary" size="md">
        Secondary
      </Button>
      <Button variant="ghost" size="md">
        Ghost
      </Button>
    </div>
}`,...m.parameters?.docs?.source},description:{story:`All variants side by side`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <Button variant="primary" size="sm">
        Small
      </Button>
      <Button variant="primary" size="md">
        Medium
      </Button>
      <Button variant="primary" size="lg">
        Large
      </Button>
    </div>
}`,...h.parameters?.docs?.source},description:{story:`All sizes side by side`,...h.parameters?.docs?.description}}},g=[`Primary`,`Secondary`,`Ghost`,`Small`,`Medium`,`Large`,`Disabled`,`Loading`,`AllVariants`,`AllSizes`]}))();export{h as AllSizes,m as AllVariants,f as Disabled,c as Ghost,d as Large,p as Loading,u as Medium,o as Primary,s as Secondary,l as Small,g as __namedExportsOrder,a as default};