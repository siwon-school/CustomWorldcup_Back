const MypageService = require('../services/mypage.service');

// Post의 컨트롤러(Controller)역할을 하는 클래스
class MypageController {
  mypageService = new MypageService(); // Post 서비스를 클래스를 컨트롤러 클래스의 멤버 변수로 할당합니다.


  getMyData = async (req, res, next) => {
    try {
      const { userId, nickname } = res.locals.user;
      
    } catch (error) {
      next(error, req, res, '내 정보 조회에 실패하였습니다.');
    }
  }

  getMyWorldcupResult = async (req, res, next) => {
    try {
      
    } catch (error) {
      next(error, req, res, '월드컵 결과 조회에 실패하였습니다.');
    }
  }

  getMyWorldcup = async (req, res, next) => {
    try {
      
    } catch (error) {
      next(error, req, res, '내가 만든 월드컵 조회에 실패하였습니다.');
    }
  }

  postPost = async (req, res, next) => {
    try {
      const { userId, nickname } = res.locals.user;
      const { title, content } = req.body;
      const input = { userId, nickname, title, content };

      if (!title || !content) {
        throw new AppError(412, '데이터 형식이 올바르지 않습니다.');
      }


      await this.postService.postPost(input);
      return res.status(201).json({ message: "게시글 작성에 성공하였습니다." });
    } catch (error) {
      next(error, req, res, '게시글 작성에 실패하였습니다.');
      // this.errorHandling(error, req, res, '게시글 작성에 실패하였습니다.');
    }
  }

  getPosts = async (req, res, next) => {
    try {
      const posts = await this.postService.getPosts();
      return res.status(200).json({ posts: posts });
    } catch (error) {
      next(error, req, res, '게시글 조회에 실패하였습니다.');
    }
  }

  getPost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const post = await this.postService.getPost(postId);
      return res.status(200).json({ post });
    } catch (error) {
      next(error, req, res, '게시글 조회에 실패하였습니다.');
    }
  }

  putPost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { title, content } = req.body;
      const { userId } = res.locals.user;
      const postData = { postId, title, content, userId };

      if (Object.keys(req.body).length !== 2 || !title || !content) {
        throw new AppError(412, '데이터 형식이 올바르지 않습니다.');
      }

      await this.postService.putPost(postData);
      return res.status(200).json({ message: '게시글을 수정하였습니다.' });
    } catch (error) {
      next(error, req, res, '게시글 수정에 실패하였습니다.');
    }
  }

  deletePost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = res.locals.user;
      const input = { postId, userId };

      await this.postService.deletePost(input);
      return res.json({ message: '게시글을 삭제하였습니다.' });
    } catch (error) {
      next(error, req, res, '게시글 삭제에 실패하였습니다.');
    }
  }

  // 에러 처리
  errorHandling = (error, req, res, defaultMessage) => {
    console.error(`${req.method} ${req.originalUrl} : ${error.message}`);
    console.error(error);

    if (!error.errorCode) {
      return res.status(400).json({ errorMessage: defaultMessage });
    } else {
      return res.status(error.errorCode).json({ errorMessage: error.errorMessage });
    }
  }
}

module.exports = MypageController;