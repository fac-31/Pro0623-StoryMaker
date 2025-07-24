# Manual Accessibility Testing Checklist

## Keyboard Navigation
- [ ] All interactive elements are reachable via Tab key
- [ ] Tab order is logical and follows visual flow
- [ ] Focus indicators are clearly visible
- [ ] Escape key closes modals/dropdowns
- [ ] Enter/Space activates buttons and links
- [ ] Arrow keys work in menus/lists where expected

## Screen Reader Testing
- [ ] Test with NVDA (Windows) or VoiceOver (Mac)
- [ ] All images have appropriate alt text
- [ ] Form labels are properly announced
- [ ] Error messages are announced
- [ ] Dynamic content changes are announced
- [ ] Modal dialogs are properly announced

## Visual Accessibility
- [ ] Text contrast meets WCAG AA (4.5:1 for normal text)
- [ ] Focus indicators are visible at 200% zoom
- [ ] Content is readable at 200% zoom without horizontal scrolling
- [ ] Color is not the only way to convey information

## Motor Accessibility
- [ ] Click targets are at least 44x44px
- [ ] Drag and drop has keyboard alternatives
- [ ] Time limits can be extended or disabled
- [ ] No content flashes more than 3 times per second

## Cognitive Accessibility
- [ ] Error messages are clear and helpful
- [ ] Forms have clear instructions
- [ ] Navigation is consistent across pages
- [ ] Important actions have confirmation dialogs

## Mobile Accessibility
- [ ] Touch targets are at least 44x44px
- [ ] Content reflows properly on small screens
- [ ] Zoom works without breaking layout
- [ ] Screen reader works on mobile devices

## Specific Areas to Test

### Dashboard
- [ ] Sidebar navigation with keyboard
- [ ] Storyboard grid/list view switching
- [ ] Team member management modals
- [ ] Search functionality

### Storyboard Creation
- [ ] Form validation and error handling
- [ ] Slide thumbnail navigation
- [ ] Modal dialog for slide details
- [ ] Progress indicators during generation

### Authentication
- [ ] Login/signup form accessibility
- [ ] Password visibility toggle
- [ ] Error message handling
- [ ] Remember me functionality