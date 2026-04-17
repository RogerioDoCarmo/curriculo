import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Modal from "./index";
import Button from "../Button";

/**
 * Modal component with overlay, focus trap, and keyboard navigation.
 *
 * Features:
 * - ESC key closes modal
 * - Backdrop click closes modal
 * - Focus trap keeps focus inside modal
 * - Proper ARIA attributes for accessibility
 */
const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Whether the modal is open",
    },
    title: {
      control: "text",
      description: "Optional title displayed at the top of the modal",
    },
    onClose: {
      action: "closed",
      description: "Function called when modal is closed",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Modal with title
 */
export const WithTitle: Story = {
  args: {
    isOpen: true,
    title: "Modal Title",
    children: (
      <div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          This is the modal content. You can put any React elements here.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="md">
            Cancel
          </Button>
          <Button variant="primary" size="md">
            Confirm
          </Button>
        </div>
      </div>
    ),
  },
};

/**
 * Modal without title
 */
export const WithoutTitle: Story = {
  args: {
    isOpen: true,
    children: (
      <div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          This modal has no title, just content.
        </p>
        <Button variant="primary" size="md">
          Got it
        </Button>
      </div>
    ),
  },
};

/**
 * Interactive modal with open/close button
 */
export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <Button variant="primary" size="md" onClick={() => setIsOpen(true)}>
          Open Modal
        </Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Interactive Modal">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Click the X button, press ESC, or click outside to close this modal.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="md" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={() => setIsOpen(false)}>
              Confirm
            </Button>
          </div>
        </Modal>
      </div>
    );
  },
};

/**
 * Confirmation modal
 */
export const Confirmation: Story = {
  args: {
    isOpen: true,
    title: "Confirm Action",
    children: (
      <div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Are you sure you want to proceed with this action? This cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="md">
            Cancel
          </Button>
          <Button variant="primary" size="md">
            Confirm
          </Button>
        </div>
      </div>
    ),
  },
};

/**
 * Form modal
 */
export const FormModal: Story = {
  args: {
    isOpen: true,
    title: "Contact Form",
    children: (
      <form className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="md">
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit">
            Submit
          </Button>
        </div>
      </form>
    ),
  },
};
