# Chat UI Fix - TODO

## Approved Plan
- [x] Analyze current chat files and identify issues
- [x] Fix `frontend/chat-tab.html` - Main 2-column chat UI
  - [x] Fix all unclosed HTML tags (userListPanel, chat-header, nav, main-wrapper)
  - [x] Fix CSS/JS class mismatch (msg-wrapper → msg-row)
  - [x] Ensure left panel 300px fixed width, scrollable
  - [x] Ensure right panel flex 1, vertical layout
  - [x] Messages container: flex 1, overflow-y auto, flex-direction column
  - [x] Input area: flex-shrink 0, no absolute positioning
  - [x] Message bubbles: proper text wrapping, no break-all
- [x] Fix `frontend/chatbox.html` - Item-specific chat UI
  - [x] Change body to flex column layout
  - [x] Chat box: flex 1, overflow-y auto
  - [x] Input: flex-shrink 0, no fixed positioning
  - [x] Proper message alignment and text wrapping
- [x] Verify both files have clean structure and existing functionality preserved

