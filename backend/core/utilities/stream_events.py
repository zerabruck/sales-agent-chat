import json
import re
from core.models.llms.llm_streams import StreamEvent, StreamEventTypes

# Pattern for complete references (with project_id)
REFERENCE_PATTERN = re.compile(r'<<account_id="([^"]+)" \s*project_id="([^"]+)">>')
# Pattern for any reference-like structure (to clean from chunks)
ANY_REFERENCE_PATTERN = re.compile(r'<<[^>]*>>')


# async def serialize_stream_events(generator):
#     buffer = ""
#
#     async for event in generator:
#         if isinstance(event, StreamEvent):
#             event_data = event.model_dump()
#
#             if event_data["event"] == StreamEventTypes.CHUNK:
#                 # Add current chunk to buffer for reference detection
#                 buffer += event_data["data"]
#                 output_buffer = buffer
#
#                 # First, find and process complete references
#                 while True:
#                     match = REFERENCE_PATTERN.search(output_buffer)
#                     if not match:
#                         break
#
#                     # Extract the reference
#                     account_id, project_id = match.groups()
#                     start, end = match.span()
#
#                     # Yield any text before the reference as a chunk, after cleaning other references
#                     if start > 0:
#                         pre_text = output_buffer[:start]
#                         # Clean any incomplete references from the pre_text
#                         clean_pre_text = ANY_REFERENCE_PATTERN.sub('', pre_text)
#                         if clean_pre_text:
#                             yield StreamEvent(
#                                 event=StreamEventTypes.CHUNK,
#                                 data=clean_pre_text
#                             ).model_dump()
#
#                     # Yield the reference event
#                     yield StreamEvent(
#                         event=StreamEventTypes.REFERENCE,
#                         data=json.dumps({
#                             "account_id": account_id,
#                             "project_id": project_id
#                         }, indent=2)
#                     ).model_dump()
#
#                     # Update buffer
#                     output_buffer = output_buffer[end:]
#
#                 # Process any remaining text, removing any reference-like patterns
#                 last_reference_start = output_buffer.rfind("<<")
#                 if last_reference_start == -1:
#                     # No partial reference, clean and yield entire buffer
#                     clean_text = ANY_REFERENCE_PATTERN.sub('', output_buffer)
#                     if clean_text:
#                         yield StreamEvent(
#                             event=StreamEventTypes.CHUNK,
#                             data=clean_text
#                         ).model_dump()
#                     buffer = ""
#                 else:
#                     # There's a potential partial reference
#                     if last_reference_start > 0:
#                         # Clean and yield text before the partial reference
#                         pre_text = output_buffer[:last_reference_start]
#                         clean_pre_text = ANY_REFERENCE_PATTERN.sub('', pre_text)
#                         if clean_pre_text:
#                             yield StreamEvent(
#                                 event=StreamEventTypes.CHUNK,
#                                 data=clean_pre_text
#                             ).model_dump()
#                     buffer = output_buffer[last_reference_start:]
#
#             else:
#                 # For non-chunk events
#                 if buffer:
#                     # Clean any reference patterns from remaining buffer
#                     clean_text = ANY_REFERENCE_PATTERN.sub('', buffer)
#                     if clean_text:
#                         yield StreamEvent(
#                             event=StreamEventTypes.CHUNK,
#                             data=clean_text
#                         ).model_dump()
#                     buffer = ""
#
#                 yield event_data
#         else:
#             yield event
#
#     # Handle any remaining buffer content
#     if buffer:
#         clean_text = ANY_REFERENCE_PATTERN.sub('', buffer)
#         if clean_text:
#             yield StreamEvent(
#                 event=StreamEventTypes.CHUNK,
#                 data=clean_text
#             ).model_dump()
#
#     # Yield the final END event
#     yield StreamEvent(event=StreamEventTypes.END, data="").model_dump()



from core.models.llms.llm_streams import StreamEvent

async def serialize_stream_events(generator):
    async for event in generator:
        if isinstance(event, StreamEvent):
            yield event.model_dump()
        else:
            yield event

    yield StreamEvent(event=StreamEventTypes.END, data="").model_dump()