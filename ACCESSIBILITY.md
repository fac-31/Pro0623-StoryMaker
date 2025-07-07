# Accessibility Guidelines for Svelte Components

This document provides basic guidelines to ensure that components developed for this project are accessible to all users, including those who rely on assistive technologies.

## 1. Semantic HTML

Use HTML elements for their intended purpose. Semantic HTML is the foundation of accessibility.

- Use `<button>` for buttons, `<a>` for links, `<nav>` for navigation, `<form>`, `<label>`, `<input>` for forms, etc.
- Ensure a logical content structure using headings (`<h1>` - `<h6>`).

## 2. ARIA Attributes

Use ARIA (Accessible Rich Internet Applications) attributes to enhance accessibility where semantic HTML alone is insufficient, especially for custom components or dynamic content.

- **Roles**: Assign appropriate roles (e.g., `role="dialog"`, `role="button"`, `role="alert"`) to elements that don't have native semantics fitting their function.
- **Labels and Descriptions**:
  - `aria-label`: Provide a label when visible text is not present (e.g., for icon buttons).
  - `aria-labelledby`: Use when the label text exists elsewhere on the page.
  - `aria-describedby`: Provide additional descriptive information not covered by the label.
- **States and Properties**:
  - `aria-modal="true"`: For modal dialogs to indicate that content outside the modal is inert.
  - `aria-invalid="true"`: For form inputs with invalid content.
  - `aria-errormessage="id_of_error_element"`: To associate an input with its error message.
  - `aria-live="polite"` or `aria-live="assertive"`: For regions with dynamic content that needs to be announced by screen readers (e.g., status messages, notifications).
  - `aria-hidden="true"`: To hide content from assistive technologies if it's purely decorative or off-screen.

## 3. Keyboard Accessibility & Focus Management

- **Focusability**: All interactive elements (links, buttons, form controls, custom controls) must be focusable using the keyboard. If using non-native interactive elements (like a `div` acting as a button), ensure it has `tabindex="0"`.
- **Focus Indicators**: All focusable elements must have a clearly visible focus indicator. Use Tailwind's focus utilities (e.g., `focus:ring-2 focus:ring-blue-500`) consistently. Avoid `outline: none;` unless a highly visible alternative is provided.
- **Focus Order**: Ensure a logical focus order, generally matching the visual reading order.
- **Focus Trapping**: For modals or off-canvas menus, trap focus within the component until it is explicitly closed.

## 4. Form Accessibility

- **Labels**: Every form input (`<input>`, `<textarea>`, `<select>`) must have an associated `<label>`. Use the `for` attribute on the label, matching the `id` of the input.
- **Error Handling**:
  - Clearly indicate errors using text and visual cues.
  - Associate error messages with their respective inputs using `aria-errormessage` and set `aria-invalid="true"` on the input.
  - Error messages should be in an element with an `id` that `aria-errormessage` can point to. Consider using `role="alert"` on error message containers if they appear dynamically.

## 5. Images

Provide descriptive alternative text for all images using the `alt` attribute.

- If an image is purely decorative and provides no information, use `alt=""`.
- For complex images, provide a longer description nearby or via `aria-describedby`.

## 6. Dynamic Content & Live Regions

When content changes dynamically (e.g., search results, status updates, modal popups), use ARIA live regions to inform screen reader users.

- `aria-live="polite"`: Announces changes when the user is idle.
- `aria-live="assertive"`: Announces changes immediately (use sparingly as it can be disruptive).
- `role="status"` or `role="alert"` can be used with `aria-live`.

## 7. Motion & Animation

Respect user preferences for reduced motion.

- Use Tailwind's `motion-safe` and `motion-reduce` utilities to control animations and transitions. For example, `motion-safe:animate-bounce` or `motion-reduce:transition-none`.

## 8. Document Language

Set the language of the document in `src/app.html` using the `lang` attribute on the `<html>` tag (e.g., `<html lang="en">`). This helps screen readers pronounce content correctly.

## Tools & Testing

- Use browser developer tools to inspect accessibility properties.
- Test with keyboard navigation only.
- Consider using automated accessibility checkers (e.g., Axe DevTools browser extension).
- Test with screen readers (e.g., NVDA, JAWS, VoiceOver).

By following these guidelines, we can create a more inclusive application.
