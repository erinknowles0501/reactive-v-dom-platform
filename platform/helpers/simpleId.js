// Simple ID - because I'm not using a bundler, uuid et al aren't (easily) available to me.
// Because this is just for learning purposes, this function returns a reasonably unique ID
// based on the current timestamp.

export default function simpleId() {
  return String(Date.now() * Math.random()).replace(".", "");
}
