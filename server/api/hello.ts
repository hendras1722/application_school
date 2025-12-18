export default defineEventHandler((event) => {
  console.log(event, 'inievent');
  return {
    hello: 'world'
  };
});
