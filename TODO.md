# TODO: Fix Download Option

## Issue
Download doesn't work properly due to CORS issues with external images from Imgflip CDN.

## Plan
1. Add a function to fetch image as blob with CORS - ✅ DONE
2. Add state to hold the blob URL - ✅ DONE
3. Update useEffect to fetch blob URL when meme changes - ✅ DONE
4. Use blob URL in the image tag instead of direct URL - ✅ DONE
5. Handle loading/error states for the image - ✅ DONE

## Additional Fix
- Fixed GEMINI_API_KEY to work with Vite using `VITE_GEMINI_API_KEY` - ✅ DONE

## File to Edit
- src/components/MemeEditor.tsx
- src/services/ai.ts
- tsconfig.json
- .env

## Status: COMPLETED ✅

## Follow-up
- Build tested successfully
- The download should now work properly by fetching images as blobs to avoid CORS issues
- API key is now properly configured with Vite environment variables


