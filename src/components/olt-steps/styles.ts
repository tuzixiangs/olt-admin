import styled from "styled-components";

export const OltStepsStyled = styled.div`
.ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-description {
  color: var(--colors-text-textMinimal) !important;
}

.ant-steps-item-wait > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-description {
  color: var(--colors-text-textDisabled) !important;
}

.ant-steps-item-error > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-description {
  color: var(--colors-text-textMinimal) !important;
}

.ant-steps-item-wait .ant-steps-item-icon > .ant-steps-icon {
  color: var(--colors-text-textDisabled) !important;
}

.ant-steps-item-error .ant-steps-item-icon > .ant-steps-icon .ant-steps-icon-dot {
  background: none !important;
  border: 2px solid var(--colors-palette-error-default) !important;
}

.ant-steps-item-wait .ant-steps-item-icon > .ant-steps-icon .ant-steps-icon-dot {
  background: none !important;
  width: 8px !important;
  height: 8px !important;
  border: 2px solid var(--colors-palette-gray-300) !important;
}

.ant-steps-horizontal .ant-steps-item-wait .ant-steps-item-icon {
  background: none !important;
  border: 2px solid var(--colors-palette-gray-200) !important;
}

.ant-steps-horizontal .ant-steps-item-content {
  margin-top: 0 !important;
}

.ant-steps-horizontal .ant-steps-item-icon {
  margin-top: 5px !important;
}

.ant-steps-horizontal.ant-steps-dot .ant-steps-item-wait .ant-steps-item-icon {
  border: none !important;
}

.ant-steps-horizontal.ant-steps-dot .ant-steps-item-tail::after,
.ant-steps-small .ant-steps-item-tail::after {
  height: 2px !important;
}

.ant-steps-horizontal.ant-steps-dot .ant-steps-item-icon > .ant-steps-icon .ant-steps-icon-dot {
  margin-top: -5px;
}

.ant-steps-vertical .ant-steps-item-title {
  line-height: 32px !important;
}
`;
