const MypageController = require("../../controllers/mypage.controller");

// posts.controller.js 에서는 아래 5개의 Method만을 사용합니다.
let mockMypageService = {
  getMyWorldcups: jest.fn(),
  getMyWorldcupResults: jest.fn(),
};

let mockRequest = {
  params: jest.fn(),
  body: jest.fn(),
};

let mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
  locals: {
    user: {
      userId: 1,
    },
  },
};

let mockNext = jest.fn();

let mypageController = new MypageController();
mypageController.mypageService = mockMypageService;

describe("MypageController Test", () => {
  /**
   -> Controller의 모든 메소드 테스트하기
   1. getMyWorldcups
   2. getMyWorldcupResults
   일단 성공 케이스부터 만들어보자.
   */

  beforeEach(() => {
    // 모든 Mock 초기화
    jest.resetAllMocks();

    // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
    mockResponse.status = jest.fn(() => {
      return mockResponse;
    });
  });

  test("getMyWorldcups success test", async () => {
    /**
     1. given
     2. when
     3. then
     */
    const myWorldcups = [
      {
        title: "최애 라면 월드컵",
        content: "최애 라면을 골라요",
      },
      {
        title: "점메추",
        content: "점심 메뉴 추천 월드컵입니다.",
      },
    ];
    mypageService.getMyWorldcups = jest.fn(() => myWorldcups);

    const { userId } = mockResponse.locals.user;
    await mypageController.getMyWorldcups(userId);

    // 1. mypageService의 getMyWorldcups 메소드를 호출하는지 확인
    expect(mypageService.getMyWorldcups).toHaveBeenCalledTimes(1);

    // 2. res.status는 200의 값을 반환하는지 확인
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    // 3. response에서 결과 데이터를 제대로 출력하는지 확인
    expect(mockResponse.json).toHaveBeenCalledWith({
      results: myWorldcups,
    });
  });

  test("getMyWorldcupResults success test", async () => {
    // PostService의 findAllPost Method를 실행했을 때 Return 값을 변수로 선언합니다.
    const myWorldcupResults = [
      {
        title: "최애 라면 월드컵",
        choice_name: "신라면",
      },
      {
        title: "점메추",
        choice_name: "원숭이골",
      },
    ];
    mypageService.getMyWorldcupResults = jest.fn(() => myWorldcupResults);

    const { userId } = mockResponse.locals.user;
    await mypageController.getMyWorldcupResults(userId);

    // 1. mypageService의 getMyWorldcupResults 메소드를 호출하는지 확인
    expect(mypageService.getMyWorldcupResults).toHaveBeenCalledTimes(1);

    // 2. res.status는 200의 값을 반환하는지 확인
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    // 3. response에서 결과 데이터를 제대로 출력하는지 확인
    expect(mockResponse.json).toHaveBeenCalledWith({
      results: myWorldcupResults,
    });
  });

  /** PostsController.createPost 성공 케이스 **/
  // 1. req.body에 들어있는 값을 바탕으로 PostService.cretePost가 호출됩니다.
  // 2. res.status는 1번 호출되고, 201의 값으로 호출됩니다.
  // 3. PostService.cretePost에서 반환된 createPostData 변수를 이용해 res.json Method가 호출됩니다.
  test("Posts Controller postPost Method by Success", async () => {
    // PostsController의 createPost Method가 실행되기 위한 Body 입력 인자들입니다.
    const reqBodyParams = {
      title: "TitleSuccess",
      content: "ContentSuccess",
    };

    mockResponse.locals.user = {
      userId: 1,
      nickname: "test",
    };

    const { title, content } = reqBodyParams;
    const { userId, nickname } = mockResponse.locals.user;
    const postData = { title, content, userId, nickname };

    // 입력 인자를 createPost Method를 실행할 때 삽입하지않고, mockRequest의 body를 createPostRequestBodyParams 변수로 설정합니다.
    mockRequest.body = reqBodyParams;

    // PostService의 createPost의 Return 값을 설정하는 변수입니다.
    const createPostReturnValue = {
      postId: 90,
      nickname: "Nickname_Success",
      title: "Title_Success",
      content: "Content_Success",
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };

    // PostService.createPost Method의 Return 값을 createPostReturnValue 변수로 설정합니다.
    mockPostService.postPost = jest.fn(() => createPostReturnValue);

    // PostsController의 createPost Method를 실행합니다.
    await postsController.postPost(mockRequest, mockResponse);

    // 1. req.body에 들어있는 값을 바탕으로 PostService.cretePost가 호출됩니다.
    expect(mockPostService.postPost).toHaveBeenCalledTimes(1);
    expect(mockPostService.postPost).toHaveBeenCalledWith(postData);

    // 2. res.status는 1번 호출되고, 201의 값으로 호출됩니다.
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);

    // 3. PostService.cretePost에서 반환된 createPostData 변수를 이용해 res.json Method가 호출됩니다.
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "게시글 작성에 성공하였습니다.",
    });
  });

  /** PostsController.createPost 에러 케이스 by InvalidParamsError **/
  // 1-1. req.body에 들어있는 값을 바탕으로 각 변수들이 객체 구조분해 할당됩니다.
  // 1-2. 필수로 전달되어야 하는 title 값이 존재하지 않아 InvalidParamsError가 발생합니다.
  // 1-3. res.status는 1번 호출되고, 400번의 Http Status Code가 호출됩니다.
  // 2. res.json의 값은 { errorMessage: "InvalidParamsError" }의 형식을 가집니다.

  // test('Posts Controller postPost Method by Invalid Params Error', async () => {

  //   // PostsController의 createPost Method가 실행될 때 에러가 발생하는 Body 입력 인자들입니다.
  //   const invalidParams = {
  //     nickname: 'Nickname_InvalidParamsError',
  //   };

  //   // 입력 인자를 createPost Method를 실행할 때 삽입하지않고, mockRequest의 body를 설정합니다.
  //   mockRequest.body = invalidParams;

  //   // PostsController의 createPost Method를 실행합니다.
  //   await postsController.postPost(mockRequest, mockResponse, mockNext);

  //   // 1-3. res.status는 1번 호출되고, 400번의 Http Status Code가 호출됩니다.
  //   expect(mockResponse.status).toHaveBeenCalledTimes(1);
  //   expect(mockResponse.status).toHaveBeenCalledWith(412);

  //   // 2. res.json Method가 호출될 때 { errorMessage: "InvalidParamsError" }의 형식을 가집니다.
  //   expect(mockResponse.json).toHaveBeenCalledWith({ errorMessage: '데이터 형식이 올바르지 않습니다.' });

  // });

  /**
   putPost를 test 하고 싶다고 치자. 그러면 뭘 어떻게 해야 하냐.
   성공,
   실패
   1. body가 비어 있음.
   2. title이 빈 칸으로 들어옴
   3. content가 빈 칸으로 들어옴.
   */

  // put post success
  // input으로 postData = { title, content, userId, postId } 가 있어야 함.
  test("Posts Controller putPost Method by Success", async () => {
    mockRequest.body.title = "title success";
    mockRequest.body.content = "content success";
    mockResponse.locals.user.userId = 1;
    mockRequest.params.postId = 1;

    const { title, content } = mockRequest.body;
    const { userId } = mockResponse.locals.user;
    const { postId } = mockRequest.params;

    const postData = { title, content, userId, postId };
    await postsController.putPost(mockRequest, mockResponse, mockNext);

    expect(mockPostService.putPost).toHaveBeenCalledTimes(1);
    expect(mockPostService.putPost).toHaveBeenCalledWith(postData);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "게시글을 수정하였습니다.",
    });
  });

  // put post Invalid error 1. body 값 안 들어온 상황
  test("Posts Controller putPost Method by No Body Error", async () => {
    mockRequest.body.title = "";
    mockRequest.body.content = "";
    mockResponse.locals.user.userId = 1;
    mockRequest.params.postId = 1;

    const { title, content } = mockRequest.body;
    const { userId } = mockResponse.locals.user;
    const { postId } = mockRequest.params;

    const postData = { title, content, userId, postId };

    await postsController.putPost(mockRequest, mockResponse, mockNext);

    // expect(mockPostService.putPost).toHaveBeenCalledTimes(1);
    // expect(mockPostService.putPost).toHaveBeenCalledWith(postData);

    // expect(mockResponse.status).toHaveBeenCalledTimes(1);
    // expect(mockResponse.status).toHaveBeenCalledWith(200);

    expect(mockNext).toHaveBeenCalledTimes(1);
    // expect(mockNext).toHaveBeenCalledWith('게시글 수정에 실패하였습니다.');
  });

  // test('', async () => {

  // });

  // test('', async () => {

  // });
});