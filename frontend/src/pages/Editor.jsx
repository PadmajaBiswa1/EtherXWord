function Editor() {
  return (
    <div
      contentEditable
      style={{
        border: "1px solid black",
        minHeight: "300px",
        padding: "10px"
      }}
    ></div>
  );
}

export default Editor;