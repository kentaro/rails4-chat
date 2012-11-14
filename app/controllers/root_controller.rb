require 'myapp/job'

class RootController < ApplicationController
  def index; end

  def post
    job = MyApp::Job.new(params[:message])
    Rails.queue.push(job)

    render json: { status: 'ok' }
  end
end
