# JayStagram (인스타 클론 프로젝트)

## 간단개요

React와 TypeScript, Firebase 를 사용하여 인스타그램의

디자인과 인증, 포스트, 메시지 기능을 구현하는 App

프로그램 웹 주소: [[Here](http://jay-stargram-2023.web.app)]

GitHub 코드 주소: [[Here](https://github.com/JayH44/JayStargram)]

기간: 2023년 2월 16일 ~ 2월 28일

## 사용한 기술 Stack

## FrontEnd

---

**MainTool**: **React** with **TypeScript**

- **SubTool**
  - React Query Firebase
  - Styled Components
  - React-Cropper
  - React-Icons, uuid

## BackEnd

---

**Firebase**: (**인증**: Authentification, **DB**: Cloud Firestore, **Storage**, **Hosting**)

## 세부 구현 기능

---

### 인증 (회원가입, 로그인)

- **회원가입**: 파일: SignUp.tsx, 경로 /signup

  - **주요기능**

    - 이름, 이메일, 비밀번호를 입력받아 React-Query-Firebase와 Firebase SDK 이용
    - Google Oauth 적용
      ![Untitled](https://firebasestorage.googleapis.com/v0/b/jay-stargram-2023.appspot.com/o/ReadMe%2FJayStargram%2FUntitled.png?alt=media&token=782616d5-68f0-4f1f-a0b3-f0b380e968bb)

      - 해당부분 코드

        ```tsx
        const mutation = useAuthCreateUserWithEmailAndPassword(auth, {
          onSuccess({ user }) {
            updateProfile(user, { displayName: name }).then(() => {
              alert('가입에 성공하셨습니다. ' + name + '님');
              navigate('/login');
            });
          },
          onError(error) {
            alert('회원가입중 문제가 발생했습니다.');
          },
        });

        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          if (
            !validateInput(name, '이름을') ||
            !validateInput(email, '이메일을') ||
            !validateInput(password, '비밀번호를')
          )
            return;

          mutation.mutate({ email, password });
        };

        const handleGoogle = () => {
          googleLogin().then((res) => {
            alert('회원가입에 성공하셨습니다, 로그인페이지로 이동합니다.');
            navigate('/login');
          });
        };
        ```

        ```tsx
        export const googleLogin = async () => {
          try {
            const result = await signInWithPopup(auth, googleProvider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            if (credential) {
            }
            return result;
          } catch (error: any) {
            GoogleAuthProvider.credentialFromError(error);
            console.log(error);
          }
        };
        ```

    - 관련 Component
      - Form.tsx
      - Input.tsx
      - Button.tsx

- **로그인:** 파일: \***\*Login.tsx, 경로 /login \*\***

  - **주요기능**

    - 회원인증 React-Query-Firebase, Google Oauth 적용
      ![Untitled](https://firebasestorage.googleapis.com/v0/b/jay-stargram-2023.appspot.com/o/ReadMe%2FJayStargram%2FUntitled%201.png?alt=media&token=fafadbd8-3324-4ebe-9380-45d25ac67728)

      - 해당 부분 코드

        ```tsx
        const mutation = useAuthSignInWithEmailAndPassword(auth, {
          onSuccess({ user }) {
            alert('환영합니다' + user.displayName + '님');
            navigate('/profile');
          },
          onError(error) {
            alert('로그인 처리중에 오류가 발생했습니다.');
          },
        });

        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          if (
            !validateInput(email, '이메일을') ||
            !validateInput(password, '비밀번호를')
          )
            return;

          mutation.mutate({ email, password });
        };

        const handleGoogle = () => {
          googleLogin().then((res) => {
            alert('회원가입에 성공하셨습니다, 로그인페이지로 이동합니다.');
            navigate('/login');
          });
        };
        ```

### 포스트 기능 (작성+사진크롭, 조회, 댓글)

- **작성**: PostEdit.tsx, 경로 /post/edit

  - **주요 기능** (사진 업로드 및 크롭, 순서변경, 텍스트 작성)

    - **사진 업로드**
      ![Untitled](https://firebasestorage.googleapis.com/v0/b/jay-stargram-2023.appspot.com/o/ReadMe%2FJayStargram%2FUntitled%202.png?alt=media&token=43dce547-1885-4f60-85ed-3fd861133ab9)

    ***

    - **여러장 동시 선택 후 순차적으로 크롭기능 (with React-Cropper)**
      ![Untitled](https://firebasestorage.googleapis.com/v0/b/jay-stargram-2023.appspot.com/o/ReadMe%2FJayStargram%2FUntitled%203.png?alt=media&token=1dd67482-37cf-4383-8fdf-8587e3f71ffc)

      - **해당 부분 코드**

        ```tsx
        {
          open && (
            <ImgCrop
              files={files}
              croppedFiles={croppedFiles}
              setCroppedFiles={setCroppedFiles}
              setOpen={setOpen}
            />
          );
        }
        ```

        ```tsx
        import { Cropper } from 'react-cropper';
        import 'cropperjs/dist/cropper.css';

        function ImgCrop({
          files,
          croppedFiles,
          setCroppedFiles,
          setOpen,
        }: ImgCropProps) {
          const [currentIndex, setCurrentIndex] = useState(0);
          const [cropper, setCropper] = useState<Cropper>();

          const handleCrop = async () => {
            if (cropper) {
              const croppedImageData = cropper.getCroppedCanvas().toDataURL();
              const croppedImageFile = await dataURItoFile(
                croppedImageData,
                files[currentIndex].name
              );
              setCroppedFiles([...croppedFiles, croppedImageFile]);
              setCurrentIndex(currentIndex + 1);

              if (currentIndex + 1 === files.length) {
                setOpen(false);
              }
            }
          };

          return (
            <Background>
              <Cropper
                src={URL.createObjectURL(files[currentIndex])}
                onInitialized={(instance) => setCropper(instance)}
                style={{ height: 400 }}
                aspectRatio={1}
              />
              <Button
                text='Crop'
                bgColor='red'
                width='200px'
                height='30px'
                onClick={handleCrop}
              />
            </Background>
          );
        }
        ```

      ***

    - **사진순서 변경&삭제 기능 (Drag & Drop 으로 순서변경)**

      ![Untitled](https://firebasestorage.googleapis.com/v0/b/jay-stargram-2023.appspot.com/o/ReadMe%2FJayStargram%2FUntitled%204.png?alt=media&token=52b894f2-c58d-443a-b644-0951bfedf95c)

      - **해당 부분 코드**

        ```tsx
        const onDragStart = (
          e: React.DragEvent<HTMLDivElement>,
          index: number
        ) => {
          e.dataTransfer.setData('text', index.toString());
        };

        const onDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
          e.preventDefault();
          const draggedIndex = parseInt(e.dataTransfer.getData('text'));
          const draggedImage = croppedFiles[draggedIndex];
          const newImages = croppedFiles.filter((_, i) => i !== draggedIndex);
          newImages.splice(index, 0, draggedImage);
          setCroppedFiles(newImages);
        };
        ```

        ```tsx
        <PreviewSmall>
          {croppedFiles.length > 0 &&
            croppedFiles.map((file, idx) => (
              <ImgBox key={idx}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={`[${idx + 1}]`}
                  draggable
                  onDragStart={(e) => onDragStart(e, idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onDrop(e, idx)}
                  onClick={() => setIdx(idx)}
                />
                <IdxBox>
                  <p>{idx + 1}</p>
                  <button onClick={() => removeImage(idx)}>삭제</button>
                </IdxBox>
              </ImgBox>
            ))}
        </PreviewSmall>
        ```

      ***

    - **글 작성 및 전송, 성공시 상세조회 페이지로 이동**
      ![Untitled](https://firebasestorage.googleapis.com/v0/b/jay-stargram-2023.appspot.com/o/ReadMe%2FJayStargram%2FUntitled%205.png?alt=media&token=15f41203-27f2-494a-9da3-fbb4ea57ce33)

      - **해당 부분 코드**

        ```tsx
        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          if (croppedFiles.length === 0) {
            alert('사진을 첨부해 주세요');
            return;
          }
          if (text === '') {
            alert('글을 작성해 주세요');
            return;
          }
          if (!user) return;

          let photoURL: string[] = [];
          for (let i = 0; i < croppedFiles.length; i++) {
            const res = await uploadFirebase(
              croppedFiles[i],
              `posts/${user?.uid}/${ref.id}`
            );
            photoURL.push(res);
          }
          const created = new Date(Date.now());
          mutation.mutate(
            {
              postId: ref.id,
              userId: user?.uid,
              text,
              photo: photoURL,
              created,
              likes: 0,
              likeUserArr: [],
            },
            {
              async onSuccess() {
                alert('글이 성공적으로 저장되었습니다.');
                await setDoc(commentRef, {
                  commentArr: [],
                });
                navigate('/post/' + ref.id + `?userId=${user?.uid}`);
              },
              onError(error) {
                alert('업로드에 실패하였습니다.');
              },
            }
          );
        };
        ```

    ***

- **조회**: PostList.tsx, 경로 /post

  - **주요 기능**

    - **최신 Post 목록 Grid 2열 Item 으로 레이아웃, 이미지 클릭시 상세조회 이동**
      ![Untitled](https://firebasestorage.googleapis.com/v0/b/jay-stargram-2023.appspot.com/o/ReadMe%2FJayStargram%2FUntitled%206.png?alt=media&token=8805118b-8d5b-4334-b5e5-5ed9fec3f7bf)
    - **최하단으로 스크롤시 추가적으로 데이터 불러오는 Infinity Scroll 적용** with (React-Infinity-Query + Intersection Observer)

      - **해당 부분 코드**

        ```tsx
        const postRef = query(
          postColl,
          orderBy('created', 'desc'),
          limit(reqQueryNum)
        );

        const postQuery = useFirestoreInfiniteQuery(
          'posts/inf',
          postRef,
          (snapshot) => {
            const lastDocument = snapshot.docs[snapshot.docs.length - 1];
            return query(postRef, startAfter(lastDocument));
          }
        );

        useEffect(() => {
          if (
            bottom &&
            bottom.current &&
            totalPageNum &&
            totalPageNum < Math.ceil(totalNum.current / reqQueryNum)
          ) {
            const observer = new IntersectionObserver(
              ([entry]) => entry.isIntersecting && postQuery.fetchNextPage(),
              { root: null, rootMargin: '0px', threshold: 0 }
            );

            observer.observe(bottom.current);
            return () => observer && observer.disconnect();
          }
        }, [bottom, postQuery, totalPageNum]);
        ```

      ***

- **상세조회**: PostDetail.tsx 경로 /post/:postId

  - **주요기능**

    - **Post 작성자, 사진, 글, 좋아요, 작성됨, 즐겨찾기, 댓글 포함**
      ![Untitled](https://firebasestorage.googleapis.com/v0/b/jay-stargram-2023.appspot.com/o/ReadMe%2FJayStargram%2FUntitled%207.png?alt=media&token=20e634fc-c4de-4a8b-9028-63b4b734f064)

    ***

    - **본인 여부에 따라 권한 및 메뉴 분기처리**

      - 해당 부분 코드

        ```tsx
        const [isOwner, setIsOwner] = useState(false);

        useEffect(() => {
          if (user?.uid === userId) {
            setIsOwner(true);
          } else {
            setIsOwner(false);
          }
        }, [user?.uid, userId]);

        {
          isOwner ? (
            <>
              <li onClick={handleDelete}>삭제</li>
              <li>수정</li>
            </>
          ) : (
            <li onClick={handleBookmark}>즐겨찾기</li>
          );
        }
        ```

    ***

    - **사진 수에 따른 Pagination**

      - 해당 부분 코드

        ```tsx
        function PostDetailItem({ data, onDoubleClick }: PostDetailItemProps) {
          const [idx, setIdx] = useState(0);

          return (
            <Container onDoubleClick={onDoubleClick}>
              <ImgBoxWrapper idx={idx}>
                {data.photo.map((url: string, idx: string) => (
                  <img key={idx} src={url} alt={data.name}></img>
                ))}
                {data.text}
              </ImgBoxWrapper>
              <BtnBox>
                {data.photo.map((url: string, bidx: number) => (
                  <LabelBtn
                    key={bidx}
                    active={bidx === idx}
                    onClick={() => setIdx(bidx)}></LabelBtn>
                ))}
              </BtnBox>
            </Container>
          );
        }
        ```

    ***

    - 좋아요, 즐겨찾기 여부 중복방지 기능

      - 해당 부분 코드

        - 좋아요

        ```tsx
        const [isLiked, setIsLiked] = useState(false);
        const [isClicked, setIsCliked] = useState(false);

        const likeMutation = useFirestoreTransaction(
          dbFirebase,
          async (tsx) => {
            const doc = await tsx.get(docref);
            const likeUserArr = doc.data()?.likeUserArr;

            const newlikeUserArr = isLiked
              ? likeUserArr.filter((id: string) => id !== user?.uid)
              : likeUserArr.concat(user?.uid);

            tsx.update(docref, {
              likes: newlikeUserArr.length,
              likeUserArr: newlikeUserArr,
            });
          }
        );

        useEffect(() => {
          if (data?.likeUserArr.indexOf(user?.uid) === -1) {
            setIsLiked(false);
          } else if (data?.likeUserArr.indexOf(user?.uid) > -1) {
            setIsLiked(true);
          }
        }, [data, user?.uid]);

        const handleLike = () => {
          setIsLiked(!isLiked);
          setIsCliked(true);
          setTimeout(() => setIsCliked(false), 2000);
          likeMutation.mutate();
        };

        {
          isLiked ? (
            <BsHeartFill onClick={handleLike} />
          ) : (
            <BsHeart onClick={handleLike} />
          );
        }
        ```

        - 북마크

        ```tsx
        const [isBookmarked, setIsBookmarked] = useState(false);

        useEffect(() => {
          if (bookmarkPostIdArr) {
            const isBooked = bookmarkPostIdArr.filter(
              (bookmark: { postId: string }) => bookmark.postId === postId
            );
            if (isBooked?.length === 0) {
              setIsBookmarked(false);
            } else if (isBooked?.length) {
              setIsBookmarked(true);
            }
          }
        }, [bookmarkPostIdArr, postId]);

        const handleBookmark = () => {
          const newPostIds = isBookmarked
            ? bookmarkPostIdArr.filter(
                (bid: { postId: string }) => bid.postId !== postId
              )
            : bookmarkPostIdArr.concat({
                postId,
                userId,
                created: data?.created,
              });

          currentUserMutation.mutate(
            {
              bookmarkPostIdArr: newPostIds,
            },
            {
              onSuccess() {
                setIsBookmarked(!isBookmarked);
              },
            }
          );
        };

        {
          isBookmarked ? (
            <BsBookmarkFill onClick={handleBookmark} />
          ) : (
            <BsBookmark onClick={handleBookmark} />
          );
        }
        ```

    ***

- **댓글**: Comment.tsx, 컴포넌트

  - **주요 기능**

    - **포스트에 대한 댓글 및 대대글 작성**
    - **초기댓글은 한개만, 더보기 클릭시 전체 보여줌**

      ![Untitled](https://firebasestorage.googleapis.com/v0/b/jay-stargram-2023.appspot.com/o/ReadMe%2FJayStargram%2FUntitled%208.png?alt=media&token=be9aab02-7576-4349-be97-1d2e123a3545)

      - 해당 부분 코드
        ```tsx
        <CommentList>
          {(commentArr.length === 1 ||
            (!dropdown && commentArr.length > 1)) && (
            <CommentItem
              comment={commentArr[0]}
              commentRep={commentRep}
              handleCommentRep={handleCommentRep}
            />
          )}
          {dropdown &&
            commentArr.map((comment: any, idx: number) => (
              <CommentItem
                key={comment.commentId}
                comment={comment}
                commentRep={commentRep}
                handleCommentRep={handleCommentRep}
              />
            ))}
          {commentArr.length > 1 && (
            <DropDown onClick={() => setDropdown(!dropdown)}>
              {dropdown ? '댓글올리기' : '댓글더보기'}
            </DropDown>
          )}
        </CommentList>
        ```

    - 댓글과 대댓글의 스타일링 표현
      - 해당 부분 코드
        ```tsx
        <Container rep={rep}>
          <img src={userPhoto} alt={userName} />
          <CommentTextBox>
            <Username>
              <div>{userName}</div>
              <div>
                {comment.created?.seconds &&
                  getTimeElapsed(comment.created.seconds)}
              </div>
            </Username>
            {comment.text}
            {!rep && (
              <CommentButtonBox
                onClick={() =>
                  handleCommentRep(`@${userName} `, comment.commentId)
                }>
                댓글달기
              </CommentButtonBox>
            )}
          </CommentTextBox>
        </Container>;
        {
          (findRep && findRep.length) > 0 &&
            findRep.map((comment: any, idx: number) => (
              <CommentItem
                key={idx}
                comment={comment}
                handleCommentRep={handleCommentRep}
                rep
              />
            ));
        }
        ```

### 메시지 채팅 기능 (채팅방 생성, 대화상대 초대, 채팅 표시)

- **채팅방 목록**: Message.tsx, 경로 /message
  - **주요 기능**
    - **본인이 참여하고 있는 채팅방 목록 생성 및 가장 최신 내용 표시**
      ![Untitled](https://firebasestorage.googleapis.com/v0/b/jay-stargram-2023.appspot.com/o/ReadMe%2FJayStargram%2FUntitled%209.png?alt=media&token=9f6eb0a1-b745-4ca2-ac53-0fe6ce8c08a0)
- **대화상대 초대**

  - 유저가 없는 채팅방의 경우 따로 버튼 생성

    ![Untitled](https://firebasestorage.googleapis.com/v0/b/jay-stargram-2023.appspot.com/o/ReadMe%2FJayStargram%2FUntitled%2010.png?alt=media&token=786715c0-89a0-410d-a063-7251bd660765)

  - 유저가 있는 경우 채팅방 이름을 클릭시 초대
    ![Untitled](https://firebasestorage.googleapis.com/v0/b/jay-stargram-2023.appspot.com/o/ReadMe%2FJayStargram%2FUntitled%2011.png?alt=media&token=06e7f495-55e9-489e-963f-1c9b72086de6)
  -

- **채팅방 내부**: MessageRoom.tsx
  - **주요 기능**
    - **메시지 Layout**
      ![Untitled](https://firebasestorage.googleapis.com/v0/b/jay-stargram-2023.appspot.com/o/ReadMe%2FJayStargram%2FUntitled%2012.png?alt=media&token=65832d84-8581-4b97-92a7-2923908ab6ff)
