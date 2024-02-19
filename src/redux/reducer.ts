import { combineReducers } from "redux";
import boardReducer from "../redux/slices/boardSlice";
import loginReducer from "../redux/slices/loginSlice";
import boardItemReducer from "../redux/slices/boardItemSlice";
import boardItemDeleteReducer from "./slices/boardItemDeleteSlice";
import boardItemModifySlice from "./slices/boardItemModifySlice";
import boardPageLikedSlice from "./slices/boardPageLikedSlice";
import boardPageComment from "./slices/commentSlice/commentSlice";
import boardPageCommentDelete from "./slices/commentSlice/commentDeleteSlice";
import boardPageCommentModifiy from "./slices/commentSlice/commentModifySlice";
import boardPageReplyComment from "./slices/ReplyComment/ReplyCommentSlice";

const rootReducer = combineReducers({
  // board: boardReducer,
  boardItemMap: boardItemReducer,
  login: loginReducer,
  boardDelete: boardItemDeleteReducer,
  boardModify: boardItemModifySlice,
  boardPageLikedSlice: boardPageLikedSlice,
  boardPageComment: boardPageComment,
  boardPageCommentDelete: boardPageCommentDelete,
  boardPageCommentModifiy: boardPageCommentModifiy,
  boardPageRepplyComment: boardPageReplyComment,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
