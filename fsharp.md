---
layout: page
title: F# Posts
---
 Total: {{ site.categories.fsharp | size }}
<div class="posts">
  <hr />
  {% for post in site.posts %}
    {% if post.categories contains 'fsharp' %}
       <div class="post-list">
        <h1 class="post-title-list">
          <a href="{{ post.url }}" onclick="ga('send', 'event', 'fsharp', 'O: {{ post.title }}', '{{ page.url }}}', 10, { 'nonInteraction': 1 });">
            {{ post.title }}
          </a>
        </h1>

        <span class="post-date-list">{{ post.date | date_to_string }}</span>
      </div>
    {% endif %}
  {% endfor %}
</div>
